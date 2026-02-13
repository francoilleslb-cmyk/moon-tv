import useAuthStore from '../store/authStore'

export default function Profile() {
  const { user } = useAuthStore()
  
  return (
    <div className="min-h-screen bg-dark-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Mi Perfil</h1>
        <div className="card">
          <div className="space-y-4">
            <div>
              <label className="text-dark-400 text-sm">Usuario</label>
              <p className="text-xl font-semibold">{user?.username}</p>
            </div>
            <div>
              <label className="text-dark-400 text-sm">Email</label>
              <p className="text-xl font-semibold">{user?.email}</p>
            </div>
            <div>
              <label className="text-dark-400 text-sm">Plan</label>
              <p className="text-xl font-semibold capitalize">{user?.subscription?.plan || 'free'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
