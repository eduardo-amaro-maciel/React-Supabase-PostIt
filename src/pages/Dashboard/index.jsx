import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import supabase from '../../services/supabse'
import Posts from '../../components/Posts'
import Toast from '../../components/Toast'
import { useAuth } from '../../context/AuthContext'
import ModalNewPostIt from '../../components/ModalNewPostIt'

function Dashboard() {
    const { user, setUser } = useAuth()
    const newPostItRef = useRef()
    const toastRef = useRef(null)
    const navigate = useNavigate()

    async function singOut(event) {
        event.preventDefault()
        const { error } = await supabase.auth.signOut()

        if (error) {
            toastRef.current.show(
                'error',
                'Ocorreu um error inesperado'
            )
        }

        setUser(null)
        navigate('/login')
    }

    return (
        <>
            <main className="bg-[image:var(--bg-dashboard)] bg-center bg-cover w-full h-[100vh] p-5 bg-no-repeat">
                <div className="h-full backdrop-blur-sm bg-[#ffffff86] shadow-sm px-12 py-5 rounded-3xl max-w-[1200px] m-auto flex flex-col">
                    <div className="w-full flex justify-between items-center mb-14">
                        <div className="flex gap-12 items-center">
                            <button data-uk-tooltip="Sing Out" onClick={e => singOut(e)}
                                className="bg-secondery p-2 rounded-xl"
                            >
                                <img src="/img/sair.svg" alt="" />
                            </button>
                            <div className="text-3xl text-secondery">
                                <b className="font-black">Olá</b><br />
                                <p className="m-0 capitalize">{user.split(" ")[0].toLowerCase()}.</p>
                            </div>
                        </div>
                        <div>
                            <button type="button" className="btn-primary text-base px-20" onClick={e => newPostItRef.current.show(true)}>
                                Novo post-it
                            </button>
                        </div>
                    </div>
                    <Posts />
                </div>
            </main>
            <ModalNewPostIt ref={newPostItRef}/>
            <Toast ref={toastRef} />
        </>
    );
}

export default Dashboard;