import { ApproxProgress, ReadingStatus } from '../types';

export function formatTimeAgo(dateString?: string): string {
  if (!dateString) return 'Not started';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays < 0) return 'Starts in future';
  if (diffInDays === 0) return 'Started today';
  if (diffInDays === 1) return 'Started yesterday';
  if (diffInDays < 30) return `Started ${diffInDays} days ago`;
  
  const months = Math.floor(diffInDays / 30);
  if (months === 1) return 'Started 1 month ago';
  if (months < 12) return `Started ${months} months ago`;

  const years = Math.floor(diffInDays / 365);
  return `Started ${years} ${years === 1 ? 'year' : 'years'} ago`;
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getProgressLabel(
  approx?: ApproxProgress,
  percent?: number
): string {
  if (percent !== undefined) {
    if (percent <= 25) return 'Just started';
    if (percent <= 75) return 'Partway through';
    return 'Nearly done';
  }

  switch (approx) {
    case 'just_started':
      return 'Just started';
    case 'partway':
      return 'Partway through';
    case 'nearly_done':
      return 'Nearly done';
    default:
      return 'In progress';
  }
}

export function getStatusBadgeLabel(status: ReadingStatus): string {
  switch (status) {
    case 'reading':
      return 'Currently Reading';
    case 'want_to_read':
      return 'Want to Read';
    case 'finished':
      return 'Finished';
    case 'dnf':
      return 'Did Not Finish';
  }
}

export function getStatusBadgeStyle(status: ReadingStatus): string {
  switch (status) {
    case 'reading':
      return 'bg-[#E4EADA] text-[#4F5D42]';
    case 'want_to_read':
      return 'bg-[#F4EEE3] text-[#9A6B52] border border-[#E4DBC9]';
    case 'finished':
      return 'bg-[#E4DBC9]/50 text-[#3F382F]';
    case 'dnf':
      return 'bg-[#FBEAEB] text-[#8C3A3A]';
  }
}
