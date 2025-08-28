import { CircleAlert } from "lucide-react";

const SignInRedirect = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5001/api/auth/google'; // update as needed
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-base-100 rounded-2xl shadow-2xl p-8 space-y-6">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="size-10 rounded-lg flex items-center justify-center">
            <CircleAlert className="w-6 h-6 text-red-800" />
          </div>
          <h1 className="text-2xl font-bold">yMeals Access</h1>
        </div>

        {/* Info */}
        <p className="text-base-content/80 text-sm">
          You need to be signed in to access this page. Log in below.
        </p>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="btn btn-primary w-full"
        >
          Sign in with Google
        </button>

        {/* Optional Note */}
        <p className="text-xs text-center text-base-content/60">
          You’ll be redirected back to the page once logged in.
        </p>
      </div>
    </div>
  );
};

export default SignInRedirect;
