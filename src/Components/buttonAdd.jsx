export default function ButtonAdd() {
    return (
        <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-md  p-2 text-white justify-between">
                <button className="flex"> <span className="mr-2">Agregar Proyecto</span> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            </button>
        </div>
    )
}
