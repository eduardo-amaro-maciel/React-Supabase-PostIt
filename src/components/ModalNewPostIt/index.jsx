import { useState, forwardRef, useImperativeHandle } from 'react'

import Modal from '../Modal';
import supabase from '../../services/supabse';

const ModalNewPostIt = forwardRef((_, ref) => {
    const [describePostIt, setDescribePostIt] = useState('')
    const [colorPostIt, setColorPostIt] = useState('')
    const [statusPostIt, setStatusPostIt] = useState('default')
    const [isSaving, setIsSaving] = useState(false)
    const [modalIsVisible, setModalIsVisible] = useState(false)

    useImperativeHandle(ref, () => {
        return {
            show(value) {
               setModalIsVisible(value)
            }
        }
    }, [])

    async function onSaveNewPost(event) {
        event.preventDefault()
        setIsSaving(true)

        if ((describePostIt === "") || (colorPostIt === "") || (statusPostIt === "" && statusPostIt != "default")) {
            alert('preencha todos os campos')

            setIsSaving(false)

        } else {
            const { data } = await supabase.auth.getUser()
            const { data: post_data, error } = await supabase
                .from('post_it')
                .insert([{
                    description: describePostIt,
                    status: statusPostIt,
                    color: colorPostIt,
                    userId: data.user.id
                }])

            if (error) {
                alert('ocorreu um erro')

            } else {
                setIsSaving(false)
                setModalIsVisible(false)
                setDescribePostIt('')
                setColorPostIt('')
                setStatusPostIt('default')
            }
        }
    }

    return (
        <Modal isVisible={modalIsVisible} fnSetVisible={setModalIsVisible}>
            <h1 className="text-3xl m-0 pb-6">Novo Post-it</h1>
            <div className="relative">
                <input type="text" maxLength={56} value={describePostIt} placeholder="Breve descrição do post-it" onChange={e => setDescribePostIt(e.target.value)}
                    className="w-full border-2 p-3 rounded focus:outline-none pr-20"
                />
                <span className="absolute right-2 top-3">{describePostIt.length}/56</span>
            </div>

            <div className="flex gap-10 mb-10 justify-center mt-5">
                <div>
                    <p className="mb-3">Cor do cartão</p>
                    <div className="flex gap-5 p-2 rounded border-2">
                        <label>
                            <input type="radio" name="color-card" checked={colorPostIt === "bg-gray"} value="bg-gray" onChange={e => setColorPostIt(e.target.value)}
                                className="hidden peer"
                            />
                            <div className="h-8 w-8 rounded-full bg-gray shadow-inner peer-checked:border-4 border-white outline-2 outline"></div>
                        </label>
                        <label>
                            <input type="radio" name="color-card" value="bg-secondery" checked={colorPostIt === "bg-secondery"} onChange={e => setColorPostIt(e.target.value)}
                                className="hidden peer"
                            />
                            <div className="h-8 w-8 rounded-full bg-secondery shadow-inner peer-checked:border-4 border-white outline-2 outline"></div>
                        </label>
                        <label>
                            <input type="radio" name="color-card" value="bg-primary" checked={colorPostIt === "bg-primary"} onChange={e => setColorPostIt(e.target.value)}
                                className="hidden peer"
                            />
                            <div className="h-8 w-8 rounded-full bg-primary shadow-inner peer-checked:border-4 border-white outline-2 outline"></div>
                        </label>
                    </div>
                </div>
                <div className="flex-1">
                    <label htmlFor="modal-select-status">Status</label>
                    <select value={statusPostIt} name="modal-select-status" onChange={e => setStatusPostIt(e.target.value)}
                        className="w-full mt-3 p-3 rounded border-2"
                    >
                        <option value="default" disable="true" hidden>
                            Status do Post-it
                        </option>
                        <option value="feito">Feito</option>
                        <option value="pendente">Pendente</option>
                    </select>
                </div>
            </div>
            <button type="button" onClick={e => onSaveNewPost(e)}
                className={"btn-primary " +
                    (isSaving ? "pointer-events-none opacity-70" : "auto opacity-100")
                }
            >
                Salvar
            </button>
        </Modal>
    );
})

export default ModalNewPostIt;