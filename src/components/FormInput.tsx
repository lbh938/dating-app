type FormInputProps = {
  label: string
  type?: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  required?: boolean
  placeholder?: string
  min?: number
  max?: number
  multiline?: boolean
  rows?: number
}

export default function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder,
  min,
  max,
  multiline = false,
  rows = 4
}: FormInputProps) {
  const baseClassName = "w-full p-3 rounded-xl bg-white border border-gray-200 text-black placeholder-gray-500 focus:outline-none focus:border-rose-500"
  
  return (
    <div>
      <label className="block text-black font-medium mb-2">{label}</label>
      {multiline ? (
        <textarea
          value={value.toString()}
          onChange={onChange}
          className={`${baseClassName} resize-none`}
          placeholder={placeholder}
          required={required}
          rows={rows}
        />
      ) : (
        <input
          type={type}
          value={value.toString()}
          onChange={onChange}
          className={baseClassName}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
        />
      )}
    </div>
  )
} 