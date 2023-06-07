import SampleReactGrid from "./components/SampleReactGrid";

function App() {
	return (
		<SampleReactGrid
			error={[
				{ row: 0, column: 0, error: Error("error1") },
				{ row: 1, column: 0, error: Error("error2") },
			]}
		/>
	);
}

export default App;
