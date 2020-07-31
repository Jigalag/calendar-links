import React, {useState, useEffect} from 'react';
import styles from './CalendarLinks.css';
import Events from "../Events/Events";
import Input from "../Input/Input";
import DatePicker from "react-datepicker";
import { minimalTimezoneSet } from 'compact-timezone-list';
import { format } from 'date-fns';

import "react-datepicker/dist/react-datepicker.css";
import Label from "../Label/Label";

function CalendarLinks({}) {
    const [linkGenerated, setLinkGenerated] = useState(false);
    const [linkGenerating, setLinkGenerating] = useState(false);
    const [today, setToday] = useState(new Date());
    const [eventTitle, setEventTitle] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [eventTimeZone, setEventTimeZone] = useState('');
    const google = React.createRef();
    const outlook = React.createRef();
    const yahoo = React.createRef();
    const [copyGoogleSuccess, setGoogleCopySuccess] = useState('');
    const [copyOutlookSuccess, setOutlookCopySuccess] = useState('');
    const [copyYahooSuccess, setYahooCopySuccess] = useState('');
    const [googleLink, setGoogleLink] = useState('');
    const [outlookLink, setOutlookLink] = useState('');
    const [yahooLink, setYahooLink] = useState('');
    const [appleLink, setAppleLink] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const getGoogleLink = (eventTitle, eventLocation, eventDescription, start, end) => {
        const urlStart = "https://www.google.com/calendar/render?action=TEMPLATE";
        return urlStart + "&text=" + encodeURI(eventTitle) + "&location=" + encodeURI(eventLocation) + "&details=" + encodeURI(eventDescription) + "&dates=" + start + "%2F" + end;
    };
    const getOutlookLink = (eventTitle, eventLocation, eventDescription, startO, endO) => {
        const urlStart = "https://outlook.live.com/calendar/deeplink/compose?path=/calendar/action/compose&rru=addevent";
        return urlStart + "&startdt=" + startO + "&enddt=" + endO + "&subject=" + encodeURI(eventTitle) + "&body=" + encodeURI(eventDescription) + "&location=" + encodeURI(eventLocation);
    };
    const getAppleLink = (eventTitle, eventLocation, eventDescription, start, end) => {
        const isLinkTag = eventDescription.indexOf('<a');
        let appleDescription = eventDescription;
        if (isLinkTag >= 0) {
            appleDescription = appleDescription.replace(/<a\s+(?:[^>]*?\s+)?href="(.*?)".*?>(.*?)<\/a>/ig, "$1");
        }
        const icsMSG = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Calendar//NONSGML v1.0//EN\nBEGIN:VEVENT\nDTSTART:" + start +"\nDTEND:" + end +"\nLOCATION:" + eventLocation + "\nDESCRIPTION:"+appleDescription+"\nSUMMARY:"+eventTitle+"\nEND:VEVENT\nEND:VCALENDAR";
        return "data:text/calendar;charset=utf8," + escape(icsMSG)
    };
    const getYahooLink = (eventTitle, eventLocation, eventDescription, start, end) => {
        const urlStart = "https://calendar.yahoo.com/?v=60";
        return urlStart + "&title=" + encodeURI(eventTitle) + "&st=" + start + "&et=" + end + "&desc=" + encodeURI(eventDescription) + "&in_loc=" + encodeURI(eventLocation)
    };
    const selectTimeZone = (e) => {
        setEventTimeZone(e.target.value);
    };
    const generateLinksByData = async (e) => {
        setLinkGenerating(true);
        e.preventDefault();
        const data = {
            startDate: format(startDate, 'L/d/yyyy'),
            endDate: format(endDate, 'L/d/yyyy'),
            startTime: format(startDate, 'p'),
            endTime: format(endDate, 'p'),
            timeZone: eventTimeZone
        };
        const response = await fetch(window.ajaxURL + '?action=getEventDate', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data),
        });
        const result = await response.json();
        const {
            dateStart,
            dateStartO,
            dateEnd,
            dateEndO,
            timeStart,
            timeStartO,
            timeEnd,
            timeEndO
        } = result;
        generateLinks({
            title: eventTitle,
            eventLocation,
            eventDescription,
            dateStart,
            dateStartO,
            dateEnd,
            dateEndO,
            timeStart,
            timeStartO,
            timeEnd,
            timeEndO
        });
        setLinkGenerated(true);
        setLinkGenerating(false);
    };
    const generateLinks = (customEvent) => {
        const currentEvent = customEvent ? customEvent : selectedEvent;
        const {title: eventTitle,
            eventLocation,
            eventDescription,
            dateStart,
            dateStartO,
            dateEnd,
            dateEndO,
            timeStart,
            timeStartO,
            timeEnd,
            timeEndO
        } = currentEvent;
        const start = dateStart + ((timeStart && timeEnd) ? `T${timeStart}Z`: '');
        const end = (dateEnd ? dateEnd : dateStart) + (timeEnd ? `T${timeEnd}Z`: '');
        const startO = dateStartO + ((timeStartO && timeEndO) ? `T${timeStartO}Z`: '');
        const endO = (dateEndO ? dateEndO : dateStartO) + (timeEndO ? `T${timeEndO}Z`: '');
        const googleHref = getGoogleLink(eventTitle, eventLocation, eventDescription, start, end);
        const outlookHref = getOutlookLink(eventTitle, eventLocation, eventDescription, startO, endO);
        const appleHref = getAppleLink(eventTitle, eventLocation, eventDescription, start, end);
        const yahooHref = getYahooLink(eventTitle, eventLocation, eventDescription, start, end);
        setGoogleLink(googleHref);
        setOutlookLink(outlookHref);
        setYahooLink(yahooHref);
        setAppleLink(appleHref);
    };
    const downloadURI = () => {
        if (appleLink) {
            const link = document.createElement("a");
            link.download = 'calendar-event.ics';
            link.href = appleLink;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    const copyGoogle = (e) => {
        google.current.select();
        document.execCommand('copy');
        e.target.focus();
        setGoogleCopySuccess('Link Copied!');
    };
    const copyOutlook = (e) => {
        outlook.current.select();
        document.execCommand('copy');
        e.target.focus();
        setOutlookCopySuccess('Link Copied!');
    };
    const copyYahoo = (e) => {
        yahoo.current.select();
        document.execCommand('copy');
        e.target.focus();
        setYahooCopySuccess('Link Copied!');
    };
    useEffect(() => {
        setLinkGenerated(false);
        if (selectedEvent) {
            generateLinks();
            setLinkGenerated(true);
        } else {
            setGoogleLink('');
            setOutlookLink('');
            setYahooLink('');
            setAppleLink('');
        }
    }, [selectedEvent]);
    useEffect(() => {
        if (copyGoogleSuccess.length > 0) {
            setTimeout(() => {
                setGoogleCopySuccess('');
            }, 5000);
        }
    }, [copyGoogleSuccess]);
    useEffect(() => {
        if (copyOutlookSuccess.length > 0) {
            setTimeout(() => {
                setOutlookCopySuccess('');
            }, 5000);
        }
    }, [copyOutlookSuccess]);
    useEffect(() => {
        if (copyYahooSuccess.length > 0) {
            setTimeout(() => {
                setYahooCopySuccess('');
            }, 5000);
        }
    }, [copyYahooSuccess]);

    useEffect(() => {
        if (startDate.getTime() > endDate.getTime()) {
            setEndDate(startDate)
        }
    }, [startDate]);

    useEffect(() => {
        if (startDate.getTime() > endDate.getTime()) {
            setStartDate(endDate)
        }
    }, [endDate]);
    return (
        <section className={styles.mainSection}>
            <Events setSelected={setSelectedEvent} />
            <div className={styles.orDiv}>
                Or
            </div>
            <div className={styles.generateEventWrapper}>
                <form>
                    <div className={styles.fieldWrapper}>
                        <div className={styles.fieldInput}>
                            <Input type="text" label={'Event Title'} value={eventTitle} onChange={setEventTitle}/>
                        </div>
                    </div>
                    <div className={styles.fieldWrapper}>
                        <div className={styles.fieldInput}>
                            <Input type="text" label={'Event Description'} value={eventDescription} onChange={setEventDescription}/>
                        </div>
                    </div>
                    <div className={styles.fieldWrapper}>
                        <div className={styles.fieldInput}>
                            <Input type="text" label={'Event Location'} value={eventLocation} onChange={setEventLocation}/>
                        </div>
                    </div>
                    <div className={styles.fieldWrapper}>
                        <div className={styles.dateWrapper}>
                            <Label>Event Date Start</Label>
                            <DatePicker
                                showTimeSelect={true}
                                dateFormat="Pp"
                                minDate={today}
                                onChange={setStartDate}
                                selected={startDate}
                            />
                        </div>
                    </div>
                    <div className={styles.fieldWrapper}>
                        <div className={styles.dateWrapper}>
                            <Label>Event Date Start</Label>
                            <DatePicker
                                showTimeSelect={true}
                                dateFormat="Pp"
                                minDate={startDate}
                                onChange={setEndDate}
                                selected={endDate}/>
                        </div>
                    </div>
                    <div className={styles.fieldWrapper}>
                        <div className={styles.fieldInput}>
                            <div className={styles.eventsSelectWrapper}>
                                <Label>Event Time Zone</Label>
                                <select onChange={selectTimeZone} className={styles.selectEvents} disabled={linkGenerating}>
                                    <option value={''}>Select Time Zone</option>
                                    {
                                        minimalTimezoneSet.map((timezone, index) => (
                                            <option value={timezone.tzCode} key={index}>
                                                {timezone.tzCode} ({timezone.offset})
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className={styles.fieldWrapper}>
                        <div className={styles.fieldInput}>
                            <Input type="submit" value="Generate Links" click={generateLinksByData} disabled={linkGenerating || !(eventTitle && eventDescription && eventLocation && eventTimeZone)}/>
                        </div>
                    </div>
                </form>
            </div>
            <>
                <div className={styles.fieldWrapper}>
                    <div className={styles.fieldInput}>
                        <Input type="text" currentRef={google} readOnly={true} value={googleLink}/>
                    </div>
                    {
                        document.queryCommandSupported('copy') && (
                            <>
                                <button className={styles.buttonCopy} onClick={copyGoogle} disabled={!linkGenerated}>
                                    Copy
                                </button>
                                <span className={styles.linkCopied}>
                                    {copyGoogleSuccess}
                                </span>
                            </>
                        )
                    }
                </div>
                <div className={styles.fieldWrapper}>
                    <div className={styles.fieldInput}>
                        <Input type="text" currentRef={outlook} readOnly={true} value={outlookLink}/>
                    </div>
                    {
                        document.queryCommandSupported('copy') && (
                            <>
                                <button className={styles.buttonCopy} onClick={copyOutlook} disabled={!linkGenerated}>
                                    Copy
                                </button>
                                <span className={styles.linkCopied}>
                                    {copyOutlookSuccess}
                                </span>
                            </>
                        )
                    }
                </div>
                <div className={styles.fieldWrapper}>
                    <div className={styles.fieldInput}>
                        <Input type="text" currentRef={yahoo} readOnly={true} value={yahooLink}/>
                    </div>
                    {
                        document.queryCommandSupported('copy') && (
                            <>
                                <button className={styles.buttonCopy} onClick={copyYahoo} disabled={!linkGenerated}>
                                    Copy
                                </button>
                                <span className={styles.linkCopied}>
                                    {copyYahooSuccess}
                                </span>
                            </>
                        )
                    }
                </div>
                <div>
                    <button type="button" onClick={downloadURI} className={styles.buttonDownload} disabled={!linkGenerated}>
                        Download .ics file
                    </button>
                </div>
            </>
        </section>
    )
}
export default CalendarLinks;
