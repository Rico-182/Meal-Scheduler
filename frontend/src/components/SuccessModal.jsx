// For displaying link
import React from 'react'
import { toast } from "react-hot-toast";
import { Paperclip } from 'lucide-react';

const SuccessModal = (props) => {
  return (
    <dialog id="success-modal" className="modal">
    <div className="modal-box space-y-5 p-10">
        <h3 className="font-bold text-lg">Meal Request Created!</h3>
        <p className="text-sm text-base-content/70">
        Here is your shareable link. You can copy and send it to someone you'd like to eat with!
        </p>
        <input
        type="text"
        readOnly
        value={`http://localhost:5173${props.link}`}
        className="input input-bordered w-full cursor-text"
        onFocus={(e) => e.target.select()}
        />
        <div>
            <button className="btn btn-accent" onClick={() => {
                navigator.clipboard.writeText(`http://localhost:5173${props.link}`);
                toast.success("Copied link to clipboard!")
                }}>
                <Paperclip/>
                Copy to clipboard
            </button>
        </div>
        
        <div className="modal-action">
            <form method="dialog">
                <button className="btn btn-primary">Close</button>
            </form>
        </div>
    </div>
    </dialog>
  )
}

export default SuccessModal