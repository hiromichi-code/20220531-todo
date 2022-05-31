import { useState } from "react";
import { db } from "./firebase";
import { setDoc, deleteDoc, doc, collection } from "firebase/firestore";

function TaskItem(props) {
	const [title, setTitle] = useState(props.title);

	const taskRef = collection(db, "tasks");

	const editTask = async () => {
		await setDoc(doc(taskRef, props.id), { title: title }, { merge: true });
	};

	const deleteTask = async () => {
		await deleteDoc(doc(taskRef, props.id));
	};

	return (
		<div className={`mt-1`}>
			<div>
				<input
					value={title}
					className={`border-b-2 border-red-300`}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<button
					className={`bg-red-300 text-white py-1 px-2 ml-1`}
					onClick={editTask}>
					edit
				</button>
				<button
					className={`bg-red-300 text-white py-1 px-2 ml-1`}
					onClick={deleteTask}>
					delete
				</button>
			</div>
		</div>
	);
}

export default TaskItem;
