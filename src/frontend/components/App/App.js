import React, { useEffect, useState } from 'react';
import Header from "../Header/Header";
import CalendarLinks from "../CalendarLinks/CalendarLinks";
import Tabs from "../Tabs/Tabs";
import Tab from "../Tab/Tab";
import Settings from "../Settings/Settings";

function App() {
    return (
        <>
            <Header/>
            <Tabs>
                <Tab title={'Generate Links'}>
                    <CalendarLinks />
                </Tab>
                <Tab title={'Settings'}>
                    <Settings />
                </Tab>
            </Tabs>
        </>
    )
}
export default App;
