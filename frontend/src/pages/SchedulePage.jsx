import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import MealScan from '../components/MealScan';
import MealSlotCard from '../components/MealCardSlot';
import ConfirmSelectionModal from '../components/ConfirmSelectionModal';
import './calendar.css';


const SchedulePage = () => {
  const { id } = useParams();
  const [requestInfo, setRequestInfo] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        // Step 1: Get request metadata
        const res1 = await fetch(`http://localhost:5001/api/meal/request-verify/${id}`, {
            method: 'GET',
            credentials: 'include',
        });
        const data1 = await res1.json();
        setRequestInfo(data1.mealRequest);

        // Step 2: Trigger slot matching
        const res2 = await fetch(`http://localhost:5001/api/meal/match/${id}/`, {
          method: 'POST',
          credentials: 'include',
        });
        const data2 = await res2.json();
        console.log(data2);
        setSlots(data2.matchedSlots || []);
      } catch (err) {
        console.error('Failed to load meal request:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleData();
  }, [id]);


  if (loading) return (
    <div className='min-h-screen bg-base-200 flex items-center justify-center px-8'>
      <MealScan/>
    </div>
  );
  if (!requestInfo) return <div>Invalid or expired meal request.</div>;

  return (
    <div className="p-6 max-w-xl mx-auto pt-20">
      <div className="w-full max-w-2xl mx-auto text-center pt-12 px-4 space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary-content">
          {requestInfo.initiatorName} wants to get a meal with you!
        </h1>
        <p className="text-base sm:text-lg text-base-content/70">
          Confirm a time and we’ll generate a GCal invite.
        </p>
        <p className="text-sm text-base-content/50 italic">
          Mutually available times are shown below.
        </p>
      </div>
        <div className="pt-10 max-w-xl items-center">
          {slots.length === 0 ? (
            <p>No mutual meal slots found.</p>
          ) : (
            <ul className="space-y-6">
              {slots.map((slot, i) => {
                const start = new Date(slot.start);
                const end = new Date(slot.end);
                return (<li key={i}>
                  <MealSlotCard start={start} end={end} meal_name={slot.meal_name} onSelect={() => {
                    setSelectedSlot({
                      meal_name: slot.meal_name, 
                      start_time: start,
                      end_time: end, 
                    });
                    }}/>
                </li>)
              })}
            </ul>
          )}
        </div>
        {selectedSlot && (
          <ConfirmSelectionModal
            meal_name={selectedSlot.meal_name}
            start_time={selectedSlot.start_time}
            end_time={selectedSlot.end_time}
            id={id}
            onCancel={() => setSelectedSlot(null)} // Optional close
          />
        )}
    </div>
  );
};

export default SchedulePage;
