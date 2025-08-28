import React, {useRef, useEffect, useState} from 'react'
import { DateTime } from 'luxon'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from "react-hot-toast";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const ConfirmSelectionModal = ({meal_name, start_time, end_time, onCancel, id}) => {
    const [isLoading, setIsLoading] = useState(false);
    const dialogRef = useRef();
    useEffect(() => {
      if (dialogRef.current) {
        dialogRef.current.showModal();
      }
    }, []);

    const slotStart = DateTime.fromJSDate(start_time);
    const slotEnd = DateTime.fromJSDate(end_time);
    const durationMins = slotEnd.diff(slotStart, 'minutes').minutes;

    const [range, setRange] = useState([0, durationMins]); // how much to offset
    // on default will use the whole range. 

    const handleSliderChange = (value) => {
    setRange(value);
    };

    const selectedStart = slotStart.plus({ minutes: range[0] });
    const selectedEnd = slotStart.plus({ minutes: range[1] });

    const handleConfirm = async () => {
        try {
            setIsLoading(true);
            const result = await axios.post(`http://localhost:5001/api/meal/create-invite/${id}/`,
                {selectedSlot: { startTime: selectedStart.toISO(), endTime: selectedEnd.toISO() }},
                {withCredentials: true, }
            );
            if (result) {
                dialogRef.current.close();
                toast.success("Created GCal Event!")
            }
        } catch (error) {
            console.log("THIS IS AN ERROR: ", error.message);
        } finally {
            setIsLoading(false); 
        }

      }
  return (
    <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
            <h3 className="font-bold text-lg p-2">Confirm Details</h3>
            <div className="space-y-2 text-sm p-2 pt-5">
                <h4>Meal: {meal_name}</h4>
                <p>Free Slot: {slotStart.toFormat('ff')} until {slotEnd.toFormat('t')}</p>

                <div className="pt-4 space-y-2">
                    <p className="font-semibold">Adjust Meal Window:</p>
                    <Slider
                    range
                    min={0}
                    max={durationMins}
                    step={5}
                    value={range}
                    onChange={handleSliderChange}
                    allowCross={false}
                    />
                    <div className="flex justify-between text-xs text-base-content/60">
                    <span>{selectedStart.toFormat('t')}</span>
                    <span>{selectedEnd.toFormat('t')}</span>
                    </div>
                </div>
            </div>

            <div className="modal-action">
                <form method="dialog" className='space-x-2'>
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-outline btn-error" onClick={onCancel}
                    >Cancel</button>
                    <button onClick={handleConfirm} type="button" className="btn btn-outline btn-success">
                        {isLoading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                Generating GCal Event...
                            </>
                            ) : (
                            "Confirm"
                        )}
                    </button>
                </form>
            </div>
        </div>
    </dialog>
  )
}

export default ConfirmSelectionModal