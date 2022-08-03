import { createContext, ReactNode, useState, useEffect } from 'react'

import { destroyCookie, setCookie, parseCookies } from 'nookies'
import Router from 'next/router'
import { toast } from 'react-toastify'

import { api } from '../services/apiClient'

type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: ( credentials: SignInProps ) => Promise<void>;
    singUp: ( credentials: SingUpProps ) => Promise<void>;
    signOut: () => void;
}

type UserProps  = {
    id: string;
    name: string;
    email: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type SingUpProps = {
    name: string;
    email: string;
    password: string;
}


type AuthProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut(){
    try{
        destroyCookie(undefined, '@nextauth.token')
        Router.push('/')
    }catch{
        console.log('erro ao deslogar')
    }
}

export function AuthProvider({ children }: AuthProviderProps){
    const [ user, setUser ] = useState<UserProps>()
    const isAuthenticated = !!user; // !! => Converte em boolean (se estiver vazio fica "false")

    useEffect( () => {
        const {'@nextauth.token': token} = parseCookies('');

        if(token){
            api.get('/userinfo')
            .then( response => {
                const {id, name, email} = response.data;
                setUser({
                    id, 
                    name, 
                    email
                })
            })
            .catch(() =>{
                signOut();
            })
        }

    }, [] )

    async function signIn({email, password}: SignInProps){
        try{
            const response = await  api.post('/session', {
                email, 
                password
            })
            const {id, name, token} = response.data;
            setCookie(undefined, '@nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, //Expirar em 30 dias
                path: "/" // Quais caminhos terão acesso ao cookie
            })
            setUser({
                id,
                name,
                email
            })
            
            //Passar para as próximas requisições o token
            api.defaults.headers['Authorization'] = `Bearer ${token}`

            toast.success('Logado com sucesso')

            //Redirecionar o user para /dashboard
            Router.push('/dashboard')
        
        }catch(err){
            toast.error('Erro ao acessar!')
            //console.log("Erro ao acessar ", err)
        }
    }

   async function singUp({name, email, password}: SingUpProps) {
    try{
        const response = await api.post('/users', {
            name, 
            email,
            password
        })

        toast.success('Conta cadastrada com sucesso!')
        Router.push('/')

    }catch(err){
        toast.error('Erro ao Cadastrar!')
        //console.log("Erro ao cadastrar ", err)
    }
   } 

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, singUp }}>
            { children }
        </AuthContext.Provider>
    )
}