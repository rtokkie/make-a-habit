import { addWeeks, endOfDay, subDays } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

import { assertDefined } from '@/utils/assert-defined';
import { formatDate } from '@/utils/format';

import { HabitsCollection } from '../collections/habits';
import { FireDocument } from '../lib/fire-document';

// NOTE: とりあえず 3 週間継続すれば、習慣化できるはずです
const targetWeeks = 3;

export const daysOptions = [
  { label: 'Mon.', value: 'Monday' },
  { label: 'Tue.', value: 'Tuesday' },
  { label: 'Wed.', value: 'Wednesday' },
  { label: 'Thu.', value: 'Thursday' },
  { label: 'Fri.', value: 'Friday' },
  { label: 'Sat.', value: 'Saturday' },
  { label: 'Sun.', value: 'Sunday' },
];

const getLabel = (v: string) => {
  const found = daysOptions.find((o) => o.value === v);
  assertDefined(found);
  return found.label;
};

export type HabitData = {
  content: string;
  days: string[];
  totalDaysCount: number;
  successDaysCount: number;
  createdAt: Timestamp;
  scheduledArchivedAt: Timestamp;
  archivedAt: Timestamp | null;
};

export interface HabitDoc extends HabitData {}
export class HabitDoc extends FireDocument<HabitData> {
  get formattedDays() {
    return this.days.map(getLabel).join(' ');
  }

  get formattedPeriod() {
    if (this.archivedAt) {
      return `${formatDate(this.createdAt)} ~ ${formatDate(this.scheduledArchivedAt)}`;
    }
    return `${formatDate(this.createdAt)} ~ (in progress)`;
  }

  get achievementRate() {
    return this.successDaysCount / this.totalDaysCount;
  }

  static create(
    collection: HabitsCollection,
    { content, days }: Pick<HabitData, 'content' | 'days'>
  ) {
    const fourWeeksLater = addWeeks(new Date(), targetWeeks);
    const scheduledArchivedAt = Timestamp.fromDate(endOfDay(subDays(fourWeeksLater, 1)));

    return new HabitDoc(
      this.makeCreateInput(collection, null, {
        content,
        days,
        totalDaysCount: days.length * targetWeeks,
        successDaysCount: 0,
        createdAt: Timestamp.now(),
        scheduledArchivedAt,
        archivedAt: null,
      })
    );
  }
}
