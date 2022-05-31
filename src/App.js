import { db, auth } from "./firebase";
import { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, query } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import TaskItem from "./TaskItem";

function App(props) {
	const [tasks, setTasks] = useState([{ id: "", title: "" }]);
	const [input, setInput] = useState("");

	const newTodo = async (e) => {
		await addDoc(collection(db, "tasks"), { title: input });
		setInput("");
	};

	useEffect(() => {
		const q = query(collection(db, "tasks"));
		const unSub = onSnapshot(q, (querySnapshot) => {
			setTasks(
				querySnapshot.docs.map((doc) => ({
					id: doc.id,
					title: doc.data().title,
				}))
			);
		});
		return () => unSub();
	}, []);

	useEffect(() => {
		const unSub = onAuthStateChanged(auth, (user) => {
			!user && props.history.push("login");
		});
		return () => unSub();
	});

	return (
		<div className={`flex flex-col items-center mt-16`}>
			<button
				className={`text-3xl text-red-200 animate-bounce`}
				onClick={async () => {
					try {
						await signOut(auth);
						props.history.push("login");
					} catch (error) {
						alert(error.message);
					}
				}}>
				Logout ?
			</button>
			<h1 className={`text-red-300 text-5xl`}>Simple Todolist</h1>
			<div className={`flex items-center mt-8`}>
				<input
					placeholder="input new todo !"
					className={`pl-1 py-1 border-2 border-red-300`}
					value={input}
					onChange={(e) => setInput(e.target.value)}
				/>
				<button
					className={`bg-red-300 text-white py-1 px-2 ml-1`}
					onClick={newTodo}>
					Add
				</button>
			</div>
			<div className={`mt-8`}>
				{tasks.map((task) => (
					<TaskItem key={task.id} id={task.id} title={task.title} />
				))}
			</div>
		</div>
	);
}

export default App;
