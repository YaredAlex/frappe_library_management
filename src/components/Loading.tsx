export const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <div className="text-lg font-semibold text-gray-700">Loading...</div>
    <div className="mt-4 animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);
