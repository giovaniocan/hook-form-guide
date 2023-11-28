import { useState } from "react"
import {  useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { z } from 'zod'

const createUserSchema = z.object({ // falando o tipo de cada informação contida no meu formulario
  avatar: z.instanceof(FileList) // aqui estamos validando o arquivo, mas não esta funcionando por causa do next
    .transform(list => list.item(0)!) // aqui é pra ter certeza que vai selecionar ou pelo menos receber apenas uma imagem
    .refine(file => file.size <= 5 *1024 * 1024, 'o arquivo deve ter no maximo 5Mb ')
    , // aqui sempre vai retornar uma lista, mesmo que seja apenas uma image
  name: z.string()
  .nonempty('O nome deve é obrigatorio')
  .transform(name => {
    return name.trim().split(' ').map(word => {
      return word[0].toLocaleUpperCase().concat(word.substring(1))
    
    }).join(' ')
  }),
  email: z.string()
    .email('Formato de e-mail invalido')
    .nonempty('o e-mail é obrigatorio')
    .refine( email => {
      return email.endsWith('.edu.br')
    }, 'o e-mail precisa ser do governo'),
  password: z.string()
    .min(6, 'A senha deve ter no minimo 6 caracteres'),
    techs:  z.array(z.object({
      title: z.string().nonempty('o titulo é obrigatório '),
      knowledge: z.coerce.number().min(1).max(100), // quando um formulario recebe um number, ele na verdade acaba passando uma stirng, então esse 'coerce arruma isso'
    })).min(2, 'Deve ter no minimo 2 tecnologias') // aqui estamos validando o array, e nao os componentes dele
})

type CreateUserFormData = z.infer<typeof createUserSchema> // inferindo o tipo de cada informação contida no meu formulario


export default function Home() {
  const { 
    register,
    handleSubmit,
    formState: { errors  }, // para pegar os erros
    control,
    } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema)
  })
  const [ output, setOutput] = useState('')

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'techs',
  })

  function handleCreateUser(data: CreateUserFormData){
    console.log(data.avatar)
    

    setOutput(JSON.stringify(data, null, 2))
  }

  function addNewTech(){
    append({
      title: '',
      knowledge: 0,
    })
  }

  return (
    <main className='h-screen  text-3xl bg-zinc-900 flex flex-col items-center justify-center'>
      <form 
        className='flex flex-col gap-4' 
        onSubmit={handleSubmit(handleCreateUser)}
        >

        <div className="flex flex-col gap-1">
          <label htmlFor="name">Avatar</label>
          <input 
            type="file" 
            accept="image/*" // para o usuario apenas selecionar imagens
            {...register('avatar')}
            />
            {errors.avatar && <p>{errors.avatar.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="name">Nome</label>
          <input 
            type="text" 
            className="border border-zinc-800 bg-zinc-700 shadow-sm h-10 p-6"
            {...register('name')}
            />
            {errors.name && <p>{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email">E-mail</label>
          <input 
            type="email" 
            className="border border-zinc-800 bg-zinc-700 shadow-sm h-10 p-6"
            {...register('email')}
            />
            {errors.email && <p>{errors.email.message}</p>} 
        </div>

     

        <div className="flex flex-col gap-1">
          <label htmlFor="password">Senha</label>
          <input 
            type="password" 
            className="border border-zinc-800 bg-zinc-700 shadow-sm h-10 p-6"
            {...register('password')}
            />
            {errors.password && <p>{errors.password.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="flex items-center justify-between" htmlFor="email">Técnologias</label>

          <button 
            type="button" 
            onClick={addNewTech}
            className="text-emerald-500 text-xl"
          >
            Adicionar
          </button>

          {fields.map ((field, index) =>  {
            return (
              <div className="flex gap-4" key={field.id}>

                <div className="flex flex-col gap-1">
                  <input 
                    type="text" 
                    className="border border-zinc-800 bg-zinc-700 shadow-sm h-10 p-6"
                    {...register(`techs.${index}.title`)} // aqui é para poder adicionar valores no array
                  />

                  {errors.techs?.[index]?.title && <p>{errors.techs?.[index]?.title?.message}</p>}

                </div>

                <div className="flex flex-col gap-1">
                  <input 
                    type="number" 
                    className="border w-36 border-zinc-800 bg-zinc-700 shadow-sm h-10 p-6"
                    {...register(`techs.${index}.knowledge`)} // aqui é para poder adicionar valores no array
                  />

                  {errors.techs?.[index]?.knowledge && <p>{errors.techs?.[index]?.knowledge?.message}</p>}

                </div>
            </div>
            )
          })}

            {errors.techs && <p>{errors.techs.message}</p>}
        </div>

        <button className="bg-emerald-500 mt-8 text-white rounded p-4 cursor-pointer hover:bg-emerald-600" type='submit'>Salvar</button>
      </form>
      <pre className="mt-10">{output}</pre>
    </main>
  )
}
