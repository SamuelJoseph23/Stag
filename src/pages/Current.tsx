import TopBar from "../components/TopBar";

type CurrentProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Dashboard({setIsOpen}: CurrentProps ) {
  return (
    <div className="flex flex-col w-screen">
      <TopBar setIsOpen={setIsOpen}/>
      <h1 className="text-2xl">Current</h1>
    </div>
  );
}