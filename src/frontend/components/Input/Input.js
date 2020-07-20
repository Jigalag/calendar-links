import React from 'react';
import styles from './Input.css';

function Input({type, value, label, onChange, placeholder, click, readOnly, currentRef}) {
    const changeHandler = (e) => {
        onChange && onChange(e.target.value);
    };
    return (
        <div className={styles.inputWrapper}>
            {
                label && (
                    <label className={styles.label}>
                        { label }
                    </label>
                )
            }
            <input type={ type }
                   value={value}
                   readOnly={readOnly}
                   ref={currentRef}
                   onChange={changeHandler}
                   placeholder={ placeholder }
                   className={styles.input}
                   onClick={(e) => click && click(e)}/>
        </div>
    )
}
export default Input;
