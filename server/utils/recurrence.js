function addMonths(date, n) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + n);
  return d;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

/**
 * Expand a recurring appointment into all occurrences within [windowStart, windowEnd].
 * Returns array of Date objects.
 */
function expandAppointment(appt, windowStart, windowEnd) {
  const start = new Date(appt.datetime);
  const stop = appt.endDate
    ? new Date(Math.min(new Date(appt.endDate), windowEnd))
    : windowEnd;

  if (appt.repeat === 'none') {
    return start >= windowStart && start <= stop ? [start] : [];
  }

  const occurrences = [];
  let current = new Date(start);

  // Fast-forward to window if start is before it
  if (appt.repeat === 'weekly') {
    while (current < windowStart) current = addDays(current, 7);
  } else if (appt.repeat === 'monthly') {
    while (current < windowStart) current = addMonths(current, 1);
  }

  while (current <= stop) {
    occurrences.push(new Date(current));
    if (appt.repeat === 'weekly') {
      current = addDays(current, 7);
    } else {
      current = addMonths(current, 1);
    }
  }

  return occurrences;
}

/**
 * Compute next refill date from a prescription's refillOn + refillSchedule.
 * Returns the next refill Date on or after today.
 */
function nextRefillDate(prescription) {
  const schedule = prescription.refillSchedule;
  let current = new Date(prescription.refillOn);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (current >= today) return current;

  while (current < today) {
    if (schedule === 'weekly') {
      current = addDays(current, 7);
    } else if (schedule === 'monthly') {
      current = addMonths(current, 1);
    } else {
      break;
    }
  }
  return current;
}

module.exports = { expandAppointment, nextRefillDate };
