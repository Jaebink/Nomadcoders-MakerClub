import { Outlet } from "react-router";
import { Button } from "~/common/components/ui/button";
import { Link } from "react-router"

export default function AuthLayout() {
  return (
    <div className="flex items-center justify-center">
        <div className="bg-white py-8 sm:rounded-lg sm:px-10">
          <Button variant="outline" asChild className="absolute top-8 right-8">
              <Link to="/" >돌아가기</Link>
          </Button>
          <Outlet />
        </div>
    </div>
  );
}
