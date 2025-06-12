export const countdownTime = (targetDate: string | undefined | null = "2025-05-31") => {
  // Convert "2025-06-02 02:49 PM" to a valid Date
  const parseDate = (dateStr: string): Date => {
    const [datePart, timePart, meridian] = dateStr.split(/[\s:]+/);
    const [year, month, day] = datePart.split("-").map(Number);
    let hours = parseInt(timePart);
    const minutes = parseInt(dateStr.match(/:(\d+)/)?.[1] || "0");

    if (meridian === "PM" && hours !== 12) hours += 12;
    if (meridian === "AM" && hours === 12) hours = 0;

    return new Date(year, month - 1, day, hours, minutes);
  };

  const createdTargetDate =
    targetDate?.includes("AM") || targetDate?.includes("PM")
      ? parseDate(targetDate)
      : new Date(targetDate ? targetDate : "");

  const currentDate = new Date();
  const difference = createdTargetDate.getTime() - currentDate.getTime();

  if (difference > 0) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  } else {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
};
