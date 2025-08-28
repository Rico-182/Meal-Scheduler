import {useState} from 'react'
import { Loader2, Calendar, MapPin, ChevronRight, ChevronLeft } from "lucide-react";
import SuccessModal from '../components/SuccessModal';
import {DateTime} from 'luxon';
import toast from 'react-hot-toast';
import "cally";
import ConfirmModal from '../components/ConfirmModal';


const MealRequestForm = () => {
    const [dateRange, setDateRange] = useState('next_3_days');
    const [minTime, setminTime] = useState("30");
    const [halls, setHalls] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [link, setLink] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tab, setTab] = useState("general");
    const [ date, setDate] = useState(null);


    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      // sends data to DB in America/New_York Time. 
      const localDate = DateTime.fromISO(date, { zone: "America/New_York" });
      const res = await fetch('http://localhost:5001/api/meal/meal-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ dateRange, preferredDiningHalls: halls, specificDate: localDate.toISODate(), minTime: parseInt(minTime) }),
      });

      const data = await res.json();
      setLink(data.shareableLink);
      if (data) {
        document.getElementById("my_modal_1").close();
      }
      document.getElementById("success-modal").showModal();
      setIsSubmitting(false);
    };


  
    return (
        <>
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-8"> 
            <div className="flex flex-col-reverse lg:flex-row items-center max-w-6xl w-full gap-12">
                {/* Left Hand Side */}
                <div className="lg:w-1/2 text-center lg:text-left space-y-6">
                    <div className="w-full max-w-md bg-base-100 text-base-content rounded-2xl shadow-xl p-10 space-y-8">
                        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 space-y-8 p-4">
                        <h2 className="text-2xl font-bold text-center">Schedule a Meal</h2>
                        
                        {/* How long? */}
                        <div className="form-control space-y-2">
                            <label className="label">
                            <span className="label-text font-medium">I need it to be at least:</span>
                            </label>
                            <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar className="h-5 w-5 text-base-content/40" />
                            </div>
                            <select
                                className="select select-bordered w-full pl-10"
                                value={minTime}
                                onChange={(e) => setminTime(e.target.value)}
                            >
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="45">45 minutes</option>
                                <option value="60">1 hour</option>
                            </select>
                            </div>
                        </div>

                        {/* Confirm Button */}
                        <button type="button" className="btn btn-primary w-full" disabled={isSubmitting} 
                        onClick={()=>{
                            if (tab === "specific" && !date) {
                                toast.error("Pick a date before continuing!");
                                return;
                            }
                            setShowConfirm(true);
                            }}>
                            {isSubmitting ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                Generating...
                            </>
                            ) : (
                            "Schedule my meal!"
                            )}
                        </button>
                        <SuccessModal link={link}/>
                        </form>
                    </div>
                </div>
                <div className="lg:w-1/2 text-center lg:text-left space-y-6 ">
                <div className="w-full max-w-md bg-base-100 text-base-content rounded-2xl shadow-xl p-10 space-y-8">
                    {/* Tabs */}
                    <div className="relative flex rounded-full bg-base-200">
                        <div
                            className="absolute h-full w-1/2 bg-primary rounded-full transition-transform duration-400"
                            style={{ transform: tab === "specific" ? "translateX(100%)" : "translateX(0%)" }}
                        />
                        <button
                            className={`flex-1 z-10 text-sm font-semibold py-2 transition-colors rounded-full ${
                                tab === "general" ? "text-white" : "text-base-content"
                              }`}
                            onClick={() => setTab("general")}
                        >
                        Timeframe
                        </button>
                        <button
                            className={`flex-1 z-10 text-sm font-semibold py-2 transition-colors rounded-full ${
                                tab === "general" ? "text-white" : "text-base-content"
                              }`}
                            onClick={() => setTab("specific")}
                        >
                        Specific Date
                        </button>
                    </div>


                {/* Calendar */}
                {(tab !== "general") ? (
                    <div className="rounded-lg p-6 flex items-center justify-center text-base-content/50">
                        <div className="flex items-center justify-center">
                            <calendar-date class="text-accent bg-base-100 border border-base-300 shadow-lg rounded-box p-4"
                                value={date}
                                onchange={(event) => setDate(event.target.value)}
                            >
                            <ChevronLeft aria-label="Previous" className="w-4 h-4 text-base-content" slot="previous" viewBox="0 0 24 24"><path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5"></path></ChevronLeft>
                            <ChevronRight aria-label="Next" className="w-4 h-4 text-base-content" slot="next" viewBox="0 0 24 24"><path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></ChevronRight>
                            <calendar-month></calendar-month>
                            </calendar-date>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-lg p-3 h-[150px] flex place-items-stretch justify-center ">
                        <div className="form-control w-full space-y-4">
                            <label className="label">
                                <span className="label-text text-lg font-medium">I wanna grab a meal within:</span>
                            </label>

                                <select
                                    className="select select-bordered w-full pl-10"
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value)}
                                >
                                    <option value="next_3_days">the next three days</option>
                                    <option value="next_week">the next week</option>
                                    <option value="next_2_weeks">the next two weeks</option>
                                </select>
                        </div>
                    </div>
                )}
                {showConfirm && 
                    (<ConfirmModal tab={tab} date={date} dateRange={dateRange} 
                        minTime={minTime} isSubmitting={isSubmitting} handleSubmit={handleSubmit} setfalse={() => setShowConfirm(false)}/>)
                }
                
                {/* <button className="btn btn-primary w-full mt-2" onClick={printDate}>Create</button> */}
            </div>
        </div>
        </div>
        </div>
    </>
    );
  };

export default MealRequestForm