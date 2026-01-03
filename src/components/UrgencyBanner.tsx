import { useState, useEffect } from "react";
import { Clock, Users, AlertTriangle } from "lucide-react";

const UrgencyBanner = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 47,
    seconds: 33,
  });

  const [viewers] = useState(Math.floor(Math.random() * 30) + 25);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 2;
              minutes = 59;
              seconds = 59;
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="bg-urgency-bg border-y border-urgency/20 py-2.5 sm:py-3 px-3 sm:px-4">
      <div className="container mx-auto flex flex-col items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-urgency font-bold">
          <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
          <span>⚠️ ATENÇÃO: ESTOQUE QUASE ESGOTADO!</span>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-sm">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-urgency" />
            <span className="font-bold text-urgency text-sm sm:text-base">
              {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span><strong className="text-destructive">{viewers}</strong> comprando agora</span>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground">Restam apenas <strong className="text-destructive">23 kits</strong> com este preço promocional</p>
      </div>
    </div>
  );
};

export default UrgencyBanner;
