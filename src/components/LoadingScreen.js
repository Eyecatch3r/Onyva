import { grid } from "ldrs";

function LoadingScreen() {
  grid.register();
  return (
    <div className="App flex justify-center items-center h-screen">
      <div className="bg-base-200 rounded-2xl w-96 justify-center items-center p-4">
        <h1 className="text-2xl font-bold">OnYva</h1>
        <l-grid size="60" speed="1.5" color="white"></l-grid>
      </div>
    </div>
  );
}

export default LoadingScreen;
