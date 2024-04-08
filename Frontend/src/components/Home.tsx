import {useSelector} from "react-redux";

const Home = () => {
    const user = useSelector((state) => state.user);

    if (!user) {
        return null;
    }

    return (
        <>
            <div>
                Logged

            </div>
        </>
    );
};

export default Home;
