import { useState } from "react"
import {  useForm, FormProvider,useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "./components/index"

import { z } from 'zod'

const createUserSchema = z.object({ // falando o tipo de cada informação contida no meu formulario
 /*  avatar: z.instanceof(FileList) // aqui estamos validando o arquivo, mas não esta funcionando por causa do next
    .transform(list => list.item(0)!) // aqui é pra ter certeza que vai selecionar ou pelo menos receber apenas uma imagem
    .refine(file => file.size <= 5 *1024 * 1024, 'o arquivo deve ter no maximo 5Mb ')
    , // aqui sempre vai retornar uma lista, mesmo que seja apenas uma image
 */  name: z.string()
  .nonempty('O nome deve é obrigatorio')
  .transform(name => {
    return name.trim().split(' ').map(word => {
      return word[0].toLocaleUpperCase().concat(word.substring(1))
    
    }).join(' ')
  }),
  email: z.string()
    .email('Formato de e-mail invalido')
    .nonempty('o e-mail é obrigatorio'),
  password: z.string()
    .min(6, 'A senha deve ter no minimo 6 caracteres'),
   /*  techs:  z.array(z.object({
      title: z.string().nonempty('o titulo é obrigatório '),
      knowledge: z.coerce.number().min(1).max(100), // quando um formulario recebe um number, ele na verdade acaba passando uma stirng, então esse 'coerce arruma isso'
    })).min(2, 'Deve ter no minimo 2 tecnologias') // aqui estamos validando o array, e nao os componentes dele
 */})

type CreateUserFormData = z.infer<typeof createUserSchema> // inferindo o tipo de cada informação contida no meu formulario


export default function Home() {
 /*  const { 
    register,
    handleSubmit,
    formState: { errors  }, // para pegar os erros
    control,
    } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema)
  }) */

  const createUserForm = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  })

  const { 
    handleSubmit, 
    formState: { isSubmitting }, 
    watch 
  } = createUserForm;

  const userPassword = watch('password')

  const isPasswordStrong = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})').test(userPassword)

  const [ output, setOutput] = useState('')

 /*  const {fields, append, remove} = useFieldArray({
    control,
    name: 'techs',
  }) */

  function handleCreateUser(data: CreateUserFormData){

    setOutput(JSON.stringify(data, null, 2))
  }

 /*  function addNewTech(){
    append({
      title: '',
      knowledge: 0,
    })
  } */

/*   {fields.map ((field, index) =>  {
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
</div> } */

  return (
    <main className='h-screen  text-3xl bg-zinc-900 flex flex-col items-center justify-center'>
      <FormProvider {...createUserForm}>
        <form 
          className='flex flex-col gap-4' 
          onSubmit={handleSubmit(handleCreateUser)}
          >

          <Form.Field>
            <Form.Label htmlFor="name">
              Nome
            </Form.Label>
            <Form.Input type="name" name="name" />
            <Form.ErrorMessage field="name" />
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor="email">
              E-mail
            </Form.Label>
            <Form.Input type="email" name="email" />
            <Form.ErrorMessage field="email" />
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor="password">
              Senha

              {isPasswordStrong 
                ? <span className="text-xs text-emerald-600">Senha forte</span>
                : <span className="text-xs text-red-500">Senha fraca</span>}
            </Form.Label>
            <Form.Input type="password" name="password" />
            <Form.ErrorMessage field="password" />
          </Form.Field>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-violet-500 text-white rounded px-3 py-2 font-semibold text-sm hover:bg-violet-600"
          >
            Salvar
          </button>

        </form>
      </FormProvider>
      <pre className="mt-10">{output}</pre>
    </main>
  )
}
