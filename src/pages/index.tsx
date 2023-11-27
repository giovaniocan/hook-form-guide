export default function Home() {
  return (
    <main className='h-screen text-black  text-3xl bg-zinc-50 flex items-center justify-center'>
      <form className='flex flex-col gap-4' action="">
        <div className="flex flex-col gap-1">
          <label htmlFor="">E-mail</label>
          <input 
            type="email" 
            name="" 
            id="" 
            className="border border-zinc-200 shadow-sm h-10 p-6"
            />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="">Nome</label>
          <input 
            type="text" 
            name="" 
            id="" 
            className="border border-zinc-200 shadow-sm h-10 p-6"
            />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="">Senha</label>
          <input 
            type="password" 
            name="" 
            id="" 
            className="border border-zinc-200 shadow-sm h-10 p-6"
            />
        </div>

        <button className="bg-emerald-500 text-white rounded p-4 cursor-pointer hover:bg-emerald-600" type='submit'>Salvar</button>
      </form>
    </main>
  )
}
