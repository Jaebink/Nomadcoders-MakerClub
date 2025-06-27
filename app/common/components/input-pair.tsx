import type { InputHTMLAttributes } from "react"
import { useState } from "react"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { ShineBorder } from "components/magicui/shine-border"

export default function InputPair({ label, textArea = false, className, ...rest }: { label?: string, textArea?: boolean, className?: string } & (InputHTMLAttributes<HTMLInputElement| HTMLTextAreaElement>)) {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    }

    const handleBlur = () => {
        setIsFocused(false);
    }

    return (
        <div className={`space-y-2 flex flex-col ${className}`}>
            <Label htmlFor={rest.id} className="flex flex-col items-start">
                {label}
            </Label>
            <div className="relative">
                {isFocused && <ShineBorder shineColor={["#FFFFF0", "#FFD700", "#FFC107", "#FF9800", "#FF5722"]} duration={10} borderWidth={1.1} className="rounded-md" />}
                {textArea ? <Textarea rows={4} className="resize-none focus-visible:ring-0" {...rest} onFocus={handleFocus} onBlur={handleBlur} /> : <Input {...rest} className="border-black focus-visible:ring-0" onFocus={handleFocus} onBlur={handleBlur} />}
            </div>
        </div>
    )
}