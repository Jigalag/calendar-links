import React, { useState, useEffect } from 'react';
import styles from './Settings.css';
import Input from "../Input/Input";

function Settings({ categories, forceCategories, setForceCategories }) {
    const [allCategories, setAllCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [currentCategories, setCurrentCategories] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const isOptionDisabled = (id) => {
        let disabled = false;
        categories.forEach((item) => {
            if (item.term_id === id*1) {
                disabled = true;
            }
        });
        return disabled
    };
    const deleteCategory = async (e, id) => {
        e.preventDefault();
        const currentSelectedCategories = currentCategories.filter(item => item.term_id !== id);
        const data = {
            categories: currentSelectedCategories
        };
        const response = await fetch(window.ajaxURL + '?action=saveCategories', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data),
        });
        const result = await response.json();
        const status = result.status;
        if (status) {
            setForceCategories(!forceCategories);
        }
    };
    const selectCategory = async (e) => {
        const categoryId = e.target.value*1;
        setSelectedCategory(categoryId);
        const category = allCategories.find(item => item.term_id === categoryId);
        const currentSelectedCategories = [...currentCategories];
        currentSelectedCategories.push(category);
        const data = {
            categories: currentSelectedCategories
        };
        const response = await fetch(window.ajaxURL + '?action=saveCategories', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data),
        });
        const result = await response.json();
        const status = result.status;
        if (status) {
            setForceCategories(!forceCategories);
            setSelectedCategory(0)
        }
    };
    useEffect(() => {
        setCurrentCategories(categories);
    }, [categories]);
    useEffect(() => {
        setCurrentCategories(categories);
        setIsLoaded(false);
        const getAllCategories = async () => {
            const result = await fetch(window.ajaxURL + '?action=getAllCategories');
            const content = await result.json();
            setAllCategories(content.data);
            setIsLoaded(true);
        };
        getAllCategories();
    }, []);
    return (
        <div className={styles.settings}>
            <form>
                <select onChange={selectCategory} value={selectedCategory} className={styles.selectEvents} disabled={!isLoaded}>
                    <option value={0}>Select Category</option>
                    {
                        allCategories.map((category, index) => (
                            <option value={category.term_id} key={index} disabled={isOptionDisabled(category.term_id)}>
                                {category.name} ({category.slug})
                            </option>
                        ))
                    }
                </select>
                {
                    currentCategories.map((item, key) => (
                        <div className={styles.fieldWrapper} key={key} >
                            <div className={styles.fieldInput}>
                                <Input type={'text'} value={item.name} disabled={true} label={`Category ${key+1}`}/>
                            </div>
                            <button className={styles.buttonCopy} onClick={(e) => deleteCategory(e, item.term_id)}>
                                Delete
                            </button>
                        </div>
                    ))
                }
            </form>
        </div>
    )
}
export default Settings;
