import { Outlet } from "react-router";
import { Button } from "~/common/components/ui/button";
import { Link } from "react-router"

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-md w-full space-y-8">        
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Button variant="ghost" asChild className="absolute top-8 right-8 bg-white">
              <Link to="/" >돌아가기</Link>
          </Button>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
