import { Button } from "~/common/components/ui/button";
import { useNavigation } from "react-router";
import { LoaderCircle } from "lucide-react";

interface LoadingButtonProps {
    className?: string;
    text: string;
}

export default function LoadingButton({ className, text }: LoadingButtonProps) {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting" || navigation.state === "loading";
    return (
        <Button type="submit" className={`w-full ${className}`} disabled={isSubmitting}>
            {isSubmitting ? (<LoaderCircle className="w-4 h-4 animate-spin" />) : (text)}
        </Button>
    )
}