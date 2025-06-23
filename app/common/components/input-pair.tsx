import type { InputHTMLAttributes } from "react"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"

export default function InputPair({ label, textArea = false, className, ...rest }: { label?: string, textArea?: boolean, className?: string } & (InputHTMLAttributes<HTMLInputElement| HTMLTextAreaElement>)) {
    return (
        <div className={`space-y-2 flex flex-col ${className}`}>
            <Label htmlFor={rest.id} className="flex flex-col items-start">
                {label}
            </Label>
            {textArea ? <Textarea rows={4} className="resize-none" {...rest} /> : <Input {...rest} />}
        </div>
    )
}
