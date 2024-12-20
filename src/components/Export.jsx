



import { useEffect, useState } from "react";
import NewspaperForm from "./Newspaper/NewspaperForm";
import QueueForm from "./Queue/QueueForm";
import DoubleQueueForm from "./DoubleQueue/DoubleQueueForm";
export default function Export({ activeSlideIndex }) {

    const [form, setForm] = useState(null);
    useEffect(() => {
        if (activeSlideIndex == 0) {
            setForm(<QueueForm />)
        }
        else if (activeSlideIndex == 1) {
            setForm(<DoubleQueueForm />)
        }
        else if (activeSlideIndex == 2) {
            setForm(<NewspaperForm />)
        }

    }, [activeSlideIndex])

    return (
        <>
            {form ? form : <div></div>}
        </>
    )
}