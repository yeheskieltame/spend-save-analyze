
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

export const formatDate = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, 'd MMMM yyyy', { locale: id });
};
