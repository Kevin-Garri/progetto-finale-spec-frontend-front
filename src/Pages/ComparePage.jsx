import Comparatore from "../components/Comparator";

export default function Compare() {
  return (
    <div>
      <h1 className="text-center text-4xl font-bold text-gray-800 my-8">
        Confronta due o più giochi👤</h1>
      <p>Qui puoi visualizzare la comparazione fra due videogiochi</p>
      <Comparatore />
    </div>
  );
}