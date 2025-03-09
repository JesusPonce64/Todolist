import { ref, getDatabase, get, query, equalTo, orderByChild} from "firebase/database";
import firebaseProyecto from "./firebaseconfig";

const db = getDatabase(firebaseProyecto);

// se hace llamada a la base de datos
export const readData = async (path, child, value) => {
    const user = query(ref(db, path), orderByChild(child) ,equalTo(value));
    
    return await get(user);
};