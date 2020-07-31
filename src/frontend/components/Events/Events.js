import React, {useState, useEffect} from 'react';
import styles from './Events.css';

function Events({setSelected}) {
    const [events, setEvents] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setError] = useState(false);
    const selectEvent = (e) => {
        const eventId = e.target.value;
        const selectedEvent = events.find((event) => event.id === eventId*1);
        setSelected(selectedEvent);
    };
    useEffect(() => {
        const getEvents = async () => {
            setIsLoaded(false);
            const result = await fetch(window.ajaxURL + '?action=getEvents');
            const content = await result.json();
            const events = content.data;
            if (events.length === 0) {
                setError(true)
            }
            setEvents(events);
            setIsLoaded(true);
        };
        getEvents();
    }, []);
    return (
        <div className={styles.eventsSelectWrapper}>
            <select onChange={selectEvent} className={styles.selectEvents} disabled={!isLoaded}>
                <option value={0}>Select Event</option>
                {
                    events.map((event, index) => (
                        <option value={event.id} key={index}>
                            {event.title}
                        </option>
                    ))
                }
            </select>
            {
                isError && (
                    <span className={styles.error}>Please select more event categories on the Settings tab or add event to the selected categories</span>
                )
            }
        </div>
    )
}
export default Events;
