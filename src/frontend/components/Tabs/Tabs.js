import React, { useState } from 'react';
import styles from './Tabs.css';

function Tabs({children}) {
    const [selected, select] = useState(0);
    const changeTab = (elem, index) => {
        !elem.props.disabled && select(index)
    };
    return (
        <div className={styles.tabsWrapper}>
            <div className={styles.tabsHeader}>
                {
                    children.map((elem, index) => {
                           let className = index === selected ? `${styles.selectedTab} ${styles.tabItem}` : styles.tabItem;
                           className+= elem.props.disabled ? ` ${styles.disabledTab}` : '';
                           return (
                               <div onClick={() => changeTab(elem, index)} className={className} key={index}>
                                   {elem.props.title}
                               </div>
                           )
                    })
                }
            </div>
            <div className={styles.tabsContent}>
                {
                    children[selected]
                }
            </div>
        </div>
    )
}
export default Tabs;
