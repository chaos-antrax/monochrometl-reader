import ThemeToggle from '@/components/ThemeToggle';
import { getCurrentUser } from '@/lib/auth';
import { DEFAULT_READER_SETTINGS } from '@/lib/constants';
import { getReaderSettings } from '@/lib/reader-settings';
export default async function GlobalThemeToggle(){const user=await getCurrentUser();const settings=user?await getReaderSettings(user.id):DEFAULT_READER_SETTINGS;return <ThemeToggle initialSettings={settings} authenticated={Boolean(user)} syncInitial/>}
