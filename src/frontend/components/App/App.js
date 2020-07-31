import React, { useEffect, useState } from 'react';
import Header from "../Header/Header";
import CalendarLinks from "../CalendarLinks/CalendarLinks";
import Tabs from "../Tabs/Tabs";
import Tab from "../Tab/Tab";
import Settings from "../Settings/Settings";

function App() {
    const [categories, setCategories] = useState([]);
    const [forceCategories, setForceCategories] = useState([]);
    useEffect(() => {
        const getCategories = async () => {
            const result = await fetch(window.ajaxURL + '?action=getCategories');
            const content = await result.json();
            setCategories(content.data);
        };
        getCategories();
    }, [forceCategories]);
    return (
        <>
            <Header/>
            <Tabs>
                <Tab title={'Generate Links'}>
                    <CalendarLinks />
                </Tab>
                <Tab title={'Settings'}>
                    <Settings categories={categories} forceCategories={forceCategories} setForceCategories={setForceCategories}/>
                </Tab>
            </Tabs>
        </>
    )
}
export default App;
