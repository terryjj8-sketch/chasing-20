// CALENDAR & HOLIDAYS DATA
const MONTH_ORDER = { january: 0, february: 1, march: 2, april: 3, may: 4, june: 5, july: 6, august: 7, september: 8, october: 9, november: 10, december: 11 };
const DAY_ORDER = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };

const DAYS_OF_WEEK_LIST = [
  { id: 'sun', label: 'Sunday', short: 'Sun' },
  { id: 'mon', label: 'Monday', short: 'Mon' },
  { id: 'tue', label: 'Tuesday', short: 'Tue' },
  { id: 'wed', label: 'Wednesday', short: 'Wed' },
  { id: 'thu', label: 'Thursday', short: 'Thu' },
  { id: 'fri', label: 'Friday', short: 'Fri' },
  { id: 'sat', label: 'Saturday', short: 'Sat' },
];

export const MONTHS_DATA = [
  { id: 'january', label: 'January', short: 'Jan', emoji: 'JAN', holiday: { id: 'new_years', label: 'New Years Day', short: 'N.Y. Day', emoji: 'NYE' } },
  { id: 'february', label: 'February', short: 'Feb', emoji: 'FEB', holiday: { id: 'presidents_day', label: 'Presidents Day', short: 'Pres. Day', emoji: 'PRES' } },
  { id: 'march', label: 'March', short: 'Mar', emoji: 'MAR', holiday: { id: 'st_patricks', label: 'St Patricks Day', short: 'St Pats', emoji: 'IRL' } },
  { id: 'april', label: 'April', short: 'Apr', emoji: 'APR', holiday: { id: 'easter', label: 'Easter', short: 'Easter', emoji: 'EGG' } },
  { id: 'may', label: 'May', short: 'May', emoji: 'MAY', holiday: { id: 'cinco_de_mayo', label: 'Cinco de Mayo', short: 'Cinco', emoji: 'CDM' } },
  { id: 'june', label: 'June', short: 'Jun', emoji: 'JUN', holiday: { id: 'juneteenth', label: 'Juneteenth', short: 'Juneteenth', emoji: 'JT' } },
  { id: 'july', label: 'July', short: 'Jul', emoji: 'JUL', holiday: { id: 'fourth_of_july', label: 'Fourth of July', short: 'July 4th', emoji: 'USA' } },
  { id: 'august', label: 'August', short: 'Aug', emoji: 'AUG', holiday: { id: 'back_to_school', label: 'Back to School Day', short: 'B2School', emoji: 'BTS' } },
  { id: 'september', label: 'September', short: 'Sep', emoji: 'SEP', holiday: { id: 'labor_day', label: 'Labor Day', short: 'Labor Day', emoji: 'LBR' } },
  { id: 'october', label: 'October', short: 'Oct', emoji: 'OCT', holiday: { id: 'halloween', label: 'Halloween', short: 'Halloween', emoji: 'BOO' } },
  { id: 'november', label: 'November', short: 'Nov', emoji: 'NOV', holiday: { id: 'thanksgiving', label: 'Thanksgiving Day', short: 'Thanksg.', emoji: 'TKY' } },
  { id: 'december', label: 'December', short: 'Dec', emoji: 'DEC', holiday: { id: 'christmas', label: 'Christmas Day', short: 'Christmas', emoji: 'XMAS' } },
];

export const MONTH_BY_ID = Object.fromEntries(MONTHS_DATA.map(m => [m.id, m]));

export function initializeCalendarDeck() {
  const deck = [];

  MONTHS_DATA.forEach(month => {
    deck.push({
      type: 'month',
      monthId: month.id,
      id: 'card_' + month.id,
      label: month.label,
      short: month.short,
      emoji: month.emoji,
      isWild: false,
      isHoliday: false,
      copy: 0,
    });

    DAYS_OF_WEEK_LIST.forEach(day => {
      deck.push({
        type: 'day',
        dayId: day.id,
        id: 'card_' + month.id + '_' + day.id,
        label: day.label,
        short: day.short,
        isWild: false,
        isHoliday: false,
        copy: 0,
      });
    });

    deck.push({
      type: 'holiday',
      monthId: month.id,
      id: 'holiday_' + month.holiday.id,
      label: month.holiday.label,
      short: month.holiday.short,
      emoji: month.holiday.emoji,
      isWild: true,
      isHoliday: true,
      copy: 0,
    });
  });

  return deck;
}

export function getCalendarStarterCards() {
  const cards = [];
  // Guarantee at least 2 months and 2 days are always offered, remaining 2 are random
  let slotTypes = ['month', 'month', 'day', 'day', Math.random() < 0.5 ? 'month' : 'day', Math.random() < 0.5 ? 'month' : 'day'];
  for (let i = slotTypes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = slotTypes[i];
    slotTypes[i] = slotTypes[j];
    slotTypes[j] = tmp;
  }
  for (let i = 0; i < 6; i++) {
    const isMonth = slotTypes[i] === 'month';
    if (isMonth) {
      const month = MONTHS_DATA[Math.floor(Math.random() * MONTHS_DATA.length)];
      cards.push({
        type: 'month',
        monthId: month.id,
        id: 'starter_month_' + month.id + '_' + i,
        label: month.label,
        short: month.short,
        emoji: month.emoji,
        isWild: false,
        isHoliday: false,
        isStarter: true,
      });
    } else {
      const day = DAYS_OF_WEEK_LIST[Math.floor(Math.random() * DAYS_OF_WEEK_LIST.length)];
      cards.push({
        type: 'day',
        dayId: day.id,
        id: 'starter_day_' + day.id + '_' + i,
        label: day.label,
        short: day.short,
        isWild: false,
        isHoliday: false,
        isStarter: true,
      });
    }
  }
  return cards;
}

export function shuffleDeckCalendar(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = deck[i];
    deck[i] = deck[j];
    deck[j] = tmp;
  }
}

export function getMonthOrder(card) {
  return MONTH_ORDER[card.monthId];
}

export function getDayOrder(card) {
  return DAY_ORDER[card.dayId];
}

export function canPlayCalendarCard(card, row) {
  if (row.cards.length === 0) return false;

  if (card.isHoliday) {
    return row.wildCount < 4;
  }

  if (row.resetPending) {
    return true;
  }

  if (card.type === 'month') {
    if (row.currentMonthOrder === undefined || row.currentMonthOrder === null) return true;
    const cardMonth = MONTH_ORDER[card.monthId];
    const diff = Math.abs(cardMonth - row.currentMonthOrder);
    return diff === 0 || diff === 1 || diff === 11;
  }

  if (card.type === 'day') {
    if (row.currentDayOrder === undefined || row.currentDayOrder === null) return true;
    const cardDay = DAY_ORDER[card.dayId];
    const diff = Math.abs(cardDay - row.currentDayOrder);
    return diff === 0 || diff === 1 || diff === 6;
  }

  return false;
}
