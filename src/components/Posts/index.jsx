import { useEffect, useState, useRef } from 'react';

import supabase from '../../services/supabse'
import Card from "../Card";
import Loading from '../Loading';
import Toast from '../Toast';

function Posts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterPostItByName, setFilterPostItByName] = useState()
    const toastRef = useRef(null)

    async function getPostIts() {
        const { data } = await supabase.auth.getUser()
        let { data: post_it, error } = await supabase
            .from('post_it')
            .select('*')
            .eq('userId', data.user.id)

        if (error) {
            toastRef.current.show(
                'error',
                'Ocorreu um error inesperado'
            )
        }

        setPosts(post_it)
        setLoading(false)
    }

    const filterPostIt = posts.length > 0
        ? posts.filter(e => e.description.toLocaleLowerCase().includes(filterPostItByName))
        : []

    useEffect(() => {
        getPostIts()

        supabase.channel('custom-insert-channel')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'post_it' },
                (payload) => {
                    setPosts(oldValue => (
                        [...oldValue, {
                            color: payload.new.color,
                            description: payload.new.description,
                            id: payload.new.id,
                            status: payload.new.status,
                        }]
                    ))

                    toastRef.current.show(
                        'success',
                        'Post-it criado com sucesso'
                    )
                }
            ).subscribe()

        supabase.channel('custom-delete-channel')
            .on(
                'postgres_changes',
                { event: 'DELETE', schema: 'public', table: 'post_it' },
                (payload) => {
                    const id = payload.old.id

                    setPosts(oldValue => (
                        oldValue.filter((value) => value.id !== id)
                    ))

                    toastRef.current.show(
                        'success',
                        'Post-it excluido com sucesso!'
                    )
                }
            ).subscribe()
    }, [])

    if (loading) {
        return <Loading />
    }

    return (
        <>
            {posts.length > 0 ? (
                <>
                    <div>
                        <input type="search" placeholder="Search" onChange={e => setFilterPostItByName(e.target.value)}
                            className="input-primary bg-[image:var(--bg-lupa)] bg-[length:20px_20px] bg-no-repeat bg-[20px_20px] px-14 bg-white border-2"
                        />
                    </div>

                    <div className="grid grid-row-1 grid-cols-4 gap-5 mt-4 overflow-y-scroll py-2 snap-none scrollbar-hide gap-y-10">
                        {filterPostIt.length > 0 ? (
                            <>
                                {filterPostIt?.map((post, index) => (
                                    <Card
                                        key={post.id}
                                        color={post.color}
                                        status={post.status}
                                        describe={post.description}
                                        id={post.id}
                                    />
                                ))}
                            </>
                        ) : (
                            <>
                                {posts?.map((post, index) => (
                                    <Card
                                        key={post.id}
                                        color={post.color}
                                        status={post.status}
                                        describe={post.description}
                                        id={post.id}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                </>
            ) : (
                <div className="flex items-center justify-center gap-5 flex-1">
                    <img
                        src="/img/no-posts.svg"
                        alt="Nenhuma tarefa encontrada"
                        className="max-w-sm w-full flex-1"
                    />
                    <div className="text-3xl max-w-sm text-secondery">
                        <b className="text-5xl mb-0">OPS!</b> <br />
                        <p>Parece que você não possui nenhum post-it.</p>
                    </div>
                </div>
            )}
            <Toast ref={toastRef} />
        </>
    );
}

export default Posts;