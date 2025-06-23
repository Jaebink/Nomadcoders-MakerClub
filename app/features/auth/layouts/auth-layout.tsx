import { Outlet } from "react-router";
import { Button } from "~/common/components/ui/button";
import { Link } from "react-router"
import { ArrowBigLeftDash } from "lucide-react";
import { cn } from "~/lib/utils";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Button variant="outline" asChild className="absolute top-8 right-8 group">
        <Link to="/" className="flex items-center justify-center">
          <span className={cn(
            "transition-opacity duration-300 ease-in-out",
            "group-hover:opacity-0 group-hover:invisible"
          )}>
            돌아가기
          </span>
          <ArrowBigLeftDash className={cn(
            "absolute inset-0 m-auto size-5",
            "transition-all duration-300 ease-in-out",
            "opacity-0 translate-x-4",
            "group-hover:opacity-100 group-hover:translate-x-0"
          )} />
        </Link>
      </Button>
      <div className="bg-white rounded-lg py-8 px-10 space-y-4">
        <Outlet />
      </div>
    </div>
  );
}