import React from 'react';
import styles from './Label.css';

function Label({children}) {
    return (
        <label className={styles.label}>
            { children }
        </label>
    )
}
export default Label;
