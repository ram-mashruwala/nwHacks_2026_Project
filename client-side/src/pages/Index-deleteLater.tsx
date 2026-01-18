import { Button } from '@/components/ui/button'
import googleLogo from '@/assets/google_logo.png'
import { getCurrentUser, loginWithGoogle, logout } from '@/lib/auth'
// import type { User } from '@/types/User'

const Index = () => {

  // const getUserData = async () => {
  //   const user: User | null = await getCurrentUser();

  //   const userNotNullType = JSON.stringify(user) || "user is null"
  //   console.log(userNotNullType);
  // }

  return (
    <div className="flex items-center justify-center">
      <div>Index</div>
      <Button
        className='bg-white'
        onClick={loginWithGoogle}
      >
        <img src={googleLogo} className="w-5 h-5 mr-2" alt="Google" />
        <p className="font-medium">Log in with Google</p>
      </Button>

      {/* TODO: if user is logged in,  */}
      <Button
        onClick={logout}
      >
        Logout
      </Button>
    </div>
  )
}

export default Index