export const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] p-6 bg-red-50 rounded-xl shadow-lg mt-8">
    <h2 className="text-6xl font-extrabold text-red-700 mb-4">404</h2>
    <p className="text-2xl text-gray-700 mb-6">Page Not Found</p>
    <p className="text-lg text-gray-600 text-center">
      Oops! The page you are looking for does not exist or you do not have
      permission to access it.
    </p>
  </div>
);
