export const countdownTime = (targetDate: string = "2025-05-31") => {
  const [year, month, day] = targetDate.split("-").map(Number);
  const createdTargetDate = new Date(year, month - 1, day);
  const currentDate: Date = new Date();
  const difference: number =
    createdTargetDate.getTime() - currentDate.getTime();

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
