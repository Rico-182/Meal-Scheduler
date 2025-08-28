import React from 'react'
import {DateTime} from 'luxon';
import { Loader2 } from 'lucide-react';
import { useRef, useEffect } from 'react';


const ConfirmModal = (props) => {
    const dialogRef = useRef();
    useEffect(() => {
        if (dialogRef.current) {
            dialogRef.current.showModal();
        }
    }, []);
  return (
    <dialog ref={dialogRef} id="my_modal_1" className="modal modal-open modal-bottom sm:modal-middle">
        <div className="modal-box rounded-2xl shadow-2xl">
            <h3 className="font-bold text-primary pt-5 border-b pb-2">Confirm Details</h3>
            <div className="space-y-2 p-6">
                <p><strong>Timeframe:</strong> {props.tab === "general" ? props.dateRange.replaceAll("_", " ") : "Specific date selected"}</p>
                {props.tab === "specific" && <p><strong>Date:</strong> 
                    {DateTime.fromISO(props.date, { zone: "America/New_York" }).toLocaleString({
                        weekday: "long",
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                    })}
                </p>}
                <p><strong>Minimum Duration:</strong> {props.minTime} minutes</p>
            </div>
            <div className="modal-action">
            <div className='space-x-2'>
                {/* if there is a button in form, it will close the modal */}
                <button onClick={() => {props.setfalse(); dialogRef.current.close();}} className="btn btn-outline btn-error"
                >Cancel</button>
                <button onClick={props.handleSubmit} className="btn btn-success">
                    {props.isSubmitting ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            Generating...
                        </>
                        ) : (
                        "Confirm"
                    )}
                </button>
            </div>
            </div>
        </div>
    </dialog>
  )
}

export default ConfirmModal