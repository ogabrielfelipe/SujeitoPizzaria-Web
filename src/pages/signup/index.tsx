import { FormEvent, useContext, useState } from 'react'

import Head from "next/head";
import Image from "next/image";
import styles from "../../../styles/home.module.scss";

import logoImg from "../../../public/logo.svg";

import { Input, TextArea } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

import { toast } from 'react-toastify'

import { AuthContext } from '../../contexts/AuthContext'

import Link from "next/link";

export default function Signup() {
  const { singUp } = useContext(AuthContext)

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  

  async function handleSingUp(event: FormEvent){
    event.preventDefault();

    if(name === '' || email === '' || password === ''){
      toast.warning('Preencha todos os campos')
      return;
    } 

    setLoading(true);
    let data = {
      email,
      name,
      password
    }

    await singUp(data);
    setLoading(false);

  }

 
  return (
    <>
      <Head>
        <title> Faça seu cadastro agora! </title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="Logo Sujeito Pizzaria" />
        <div className={styles.login}>
          <h1> Criando sua conta </h1>
          <form onSubmit={handleSingUp}>
            <Input 
              placeholder="Digite seu nome" 
              type="text" 
              value={name}
              onChange={ (e) => setName(e.target.value) }
            />

            <Input 
              placeholder="Digite seu email" 
              type="text" 

              value={email}
              onChange={ (e) => setEmail(e.target.value) }
            />
            <Input 
            placeholder="Digite sua senha" 
            type="password" 

            value={password}
            onChange={ (e) => setPassword(e.target.value) }
            />

            <Button 
              type="submit" 
              loading={loading}
            >
              Cadastrar
            </Button>
          </form>
          <Link href="/">
            <a className={styles.text}> Já possui uma conta? Faça login </a>
          </Link>
        </div>
      </div>
    </>
  );
}
