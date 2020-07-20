import React, { useState, useEffect } from 'react';
import styles from './Settings.css';
import Input from "../Input/Input";

function Settings({  }) {
    const [categories, setCategories] = useState('');
    const generalSubmit = (e) => {
        e.preventDefault();
        console.log(categories);
        const data = {
        };
        fetch(window.ajaxURL + '?action=saveSettings', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data),
        })
    };
    useEffect(() => {

    }, []);
    return (
        <div className={styles.settings}>
            <form>
                <Input type={'number'} value={categories} onChange={setCategories} label={'Events Categories IDs'}/>
                <Input type={'submit'} click={ generalSubmit } />
            </form>
        </div>
    )
}
export default Settings;
