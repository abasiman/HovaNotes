import { useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, getDocs, doc, updateDoc, getDoc} from "@firebase/firestore";
import {database }from "./firebase_todapp_config";
import { authdatabase } from './firebase_todapp_config';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';



const TodoApp = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [todolist, setTodoList] = useState([]);
    const [activeMenuTodoId, setActiveMenuTodoId] = useState(null);
    const [isEditing, setIsEditing] = useState(null);
    const [showTodoList, setShowTodoList] = useState(true); // Show todo list by default
    const [showCompletedTasks, setShowCompletedTasks] = useState(false);
    const navigate = useNavigate();

    const handletitleinput = (e) => setTitle(e.target.value);
    const handledescinpute = (e) => setDescription(e.target.value);

   /*  const collectionref = collection(database, "todos"); */

    const handleAdd = async (e) => {
        e.preventDefault();
        const userUID = authdatabase.currentUser?.uid;
        if (!userUID) return; // Guard clause to ensure there is a logged-in user
        if (!title.trim() || !description.trim()) {
            alert("Please enter both a title and a description.");
            return;
        }
        const userTodosRef = collection(database, `todos/${userUID}/userTodos`);
        await addDoc(userTodosRef, { ttl: title, desc: description, completed: false });
        setTitle('');
        setDescription('');
        fetchTodos();
    };
    

    const handledeletenote = async (todoId) => {
        const userUID = authdatabase.currentUser?.uid;
        await deleteDoc(doc(database, `todos/${userUID}/userTodos`, todoId));
        fetchTodos();
    };
    

    const handleSaveEdit = async (todoId, newTitle, newDesc) => {
        const userUID = authdatabase.currentUser?.uid;
        await updateDoc(doc(database, `todos/${userUID}/userTodos`, todoId), { ttl: newTitle, desc: newDesc });
        setIsEditing(null);
        fetchTodos();
    };
    

    const handleEditClick = (todo) => {
        setIsEditing(todo.id);
        setActiveMenuTodoId(null);
    };

    const handleMoreClick = (todoId) => {
        setActiveMenuTodoId(prevId => prevId === todoId ? null : todoId);
    };

    const handlecompletedClick = async (todoId) => {
        const userUID = authdatabase.currentUser?.uid;
        const todoRef = doc(database, `todos/${userUID}/userTodos`, todoId);
        const todoSnap = await getDoc(todoRef);
        if (todoSnap.exists()) {
            const currentStatus = todoSnap.data().completed || false;
            await updateDoc(todoRef, { completed: !currentStatus });
        }
        fetchTodos();
    };
    
    

    const fetchTodos = async () => {
        const userUID = authdatabase.currentUser?.uid;
        if (!userUID) return; // Guard clause to ensure there is a logged-in user
        const userTodosRef = collection(database, `todos/${userUID}/userTodos`);
        const querySnapshot = await getDocs(userTodosRef);
        setTodoList(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };
    

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(authdatabase, (user) => {
            if (user) {
                fetchTodos(); // Call fetchTodos only if there is a user
            } else {
                setTodoList([]); // Optionally clear the todos if there is no user
            }
        });
    
        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const handleSignOut = () => {
        signOut(authdatabase).then(() => navigate('/'))
            .catch((error) => console.error("Sign out error", error));
    };
    

    return (
        <>
        <header>
            <div className="head">
                <div className="img-Container">
                    <img src="/public/hovalogo.png" alt="Logo"/>
                    <h4>Hova Notes</h4>
                </div>
            </div>
        </header>
        <div className="Todo-Container">
            <form onSubmit={handleAdd}>
                <input className="titleinput" value={title} onChange={handletitleinput} type="text" placeholder="Title"/>
                <textarea className='desc_area' value={description} onChange={handledescinpute} placeholder="Descriptions"/>
                <button type="submit" className="add_btn">Add</button>
            </form>
            <div className="nav_buttons">
                <button className={`todolist_btn ${showTodoList ? 'activeButton' : ''}`} onClick={() => {setShowTodoList(true); setShowCompletedTasks(false);}}>View Todolist</button>
                <button className={`completed_btn ${showCompletedTasks ? 'activeButton' : ''}`} onClick={() => {setShowTodoList(false); setShowCompletedTasks(true);}}>View Completed</button>
            </div>
            {showTodoList && (
                <>
                    <h2>Todo List</h2>
                    <div className="todoscontainer">
                        {todolist.filter(todo => !todo.completed).map((todo, index) => (
                            <div key={index} className="displaytodoslist">
                                <div className="todoContent">
                                    <div>
                                        <h2 contentEditable={isEditing === todo.id} onBlur={(e) => handleSaveEdit(todo.id, e.currentTarget.textContent, todo.desc)} suppressContentEditableWarning={true}>
                                            {todo.ttl}
                                        </h2>
                                        <h3 contentEditable={isEditing === todo.id} onBlur={(e) => handleSaveEdit(todo.id, todo.ttl, e.currentTarget.textContent)} suppressContentEditableWarning={true}>
                                            {todo.desc}
                                        </h3>
                                    </div>
                                    <span className="moreIcon" onClick={() => handleMoreClick(todo.id)}>⋮</span>
                                    {activeMenuTodoId === todo.id && (
                                        <div className="menu">
                                            <ul>
                                                <li onClick={() => handleEditClick(todo)}>Edit</li>
                                                <li onClick={() => handledeletenote(todo.id)}>Delete</li>
                                                <li onClick={() => handlecompletedClick(todo.id)}>Mark Completed</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
            {showCompletedTasks && (
                <>
                    <h2>Completed Tasks</h2>
                    <div className="todoscontainer">
                        {todolist.filter(todo => todo.completed).map((todo, index) => (
                            <div key={index} className="displaytodoslist">
                                <div className="todoContent">
                                    <div>
                                        <h2>{todo.ttl}</h2>
                                        <h3>{todo.desc}</h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
            <div className='home-btn'>
                <button className="profile-btns" onClick={handleSignOut}>Sign Out</button>
            </div>
        </div>
        </>
    );
    
};

export default TodoApp;
