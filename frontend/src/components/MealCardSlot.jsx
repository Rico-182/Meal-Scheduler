import { CalendarDays, Clock, MapPin } from "lucide-react";

const MealSlotCard = ({ meal_name, start, end, onSelect }) => {

  return (
    <div className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl hover:border-primary transition duration-300">
      <div className="card-body space-y-2">
        <h3 className="card-title capitalize text-primary">{meal_name}</h3>

        <div className="flex items-center gap-2 text-sm text-base-content/70">
          <CalendarDays className="w-4 h-4" />
          <span>{start.toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-base-content/70">
          <Clock className="w-4 h-4" />
          <span>{start.toLocaleTimeString()} – {end.toLocaleTimeString()}</span>
        </div>

        {/* {diningHall && (
          <div className="flex items-center gap-2 text-sm text-base-content/70">
            <MapPin className="w-4 h-4" />
            <span>{diningHall}</span>
          </div>
        )} */}

        <div className="card-actions mt-4">
          <button
            onClick={onSelect}
            className="btn btn-sm btn-primary w-full"
          >
            Select Slot
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealSlotCard;
