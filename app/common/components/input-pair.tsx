import type { InputHTMLAttributes } from "react"
import { useState } from "react"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { ShineBorder } from "components/magicui/shine-border"
import { EyeIcon, EyeOffIcon } from "lucide-react"

export default function InputPair({ label, textArea = false, isPassword = false, className, ...rest }: { label?: string, textArea?: boolean, isPassword?: boolean, className?: string } & (InputHTMLAttributes<HTMLInputElement| HTMLTextAreaElement>)) {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    }

    const handleBlur = () => {
        setIsFocused(false);
    }

    if (isPassword) {
        return (
            <div className={`space-y-2 flex flex-col ${className}`}>
                <Label htmlFor={rest.id} className="flex flex-col items-start">
                    {label}
                </Label>
                <div className="relative">
                    {isFocused && <ShineBorder shineColor={["#FFFFF0", "#FFD700", "#FFC107", "#FF9800", "#FF5722"]} duration={10} borderWidth={1.1} className="rounded-md" />}
                    {textArea ? <Textarea rows={4} className="resize-none focus-visible:ring-0" {...rest} onFocus={handleFocus} onBlur={handleBlur} /> : <Input {...rest} className="border-black focus-visible:ring-0" onFocus={handleFocus} onBlur={handleBlur} type={showPassword ? "text" : "password"} />}
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700">
                        {showPassword ? <EyeOffIcon className="size-5" /> : <EyeIcon className="size-5" />}
                    </button>
                </div>
            </div>
        )
    } else {
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
}