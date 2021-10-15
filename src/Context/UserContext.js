import { createContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { auth } from "../Firebase";

export const UserContext = createContext();

const UserProvider = (props) => {
    const [user, setUser] = useState('');
    const history = useHistory();

    useEffect(() => {
        const checkUser =
            auth.onAuthStateChanged((authUser) => {
                if (authUser) {
                    const { displayName, photoURL, email, uid } = authUser;
                    setUser({
                        displayName, photoURL, email, uid
                    })
                    history?.push('/');
                }
            })
        return () => checkUser();
    }, [history])

    return (
        <UserContext.Provider value={{ user }}>
            {props.children}
        </UserContext.Provider>
    );
}
export default UserProvider;