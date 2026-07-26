'use client';
import { useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import { READER_SETTINGS_STORAGE_KEY } from '@/lib/constants';
import { authenticatedFetch, responseError } from '@/lib/client-api';
import { notify } from '@/lib/toast';
import type { ReaderBackground, ReaderSettings } from '@/types/reader';
const backgrounds: { id: ReaderBackground; label: string; color: string }[] = [{id:'paper',label:'Paper',color:'#f7f4ed'},{id:'white',label:'White',color:'#ffffff'},{id:'warm',label:'Warm',color:'#fbf1df'},{id:'sepia',label:'Sepia',color:'#efe0c8'},{id:'sage',label:'Sage',color:'#eef3ea'},{id:'mist',label:'Mist',color:'#eef2f5'},{id:'charcoal',label:'Charcoal',color:'#202020'},{id:'black',label:'Black',color:'#050505'}];
const fontSizes = [15,16,17,18,19,20,22,24,26]; const lineHeights = [1.4,1.55,1.7,1.85,2];
export default function AccountPreferences({ initialSettings }: { initialSettings: ReaderSettings }) {
  const [settings, setSettings] = useState(initialSettings); const [saveState, setSaveState] = useState<'saved'|'saving'|'error'>('saved');
  async function update<K extends keyof ReaderSettings>(key: K, value: ReaderSettings[K]) {
    const previous = settings; const next = { ...settings, [key]: value }; setSettings(next); setSaveState('saving'); localStorage.setItem(READER_SETTINGS_STORAGE_KEY, JSON.stringify(next));
    try { const response = await authenticatedFetch('/api/settings', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(next) }); if (!response.ok) throw new Error(await responseError(response, 'Unable to save reader preferences.')); setSaveState('saved'); }
    catch (error) { setSettings(previous); localStorage.setItem(READER_SETTINGS_STORAGE_KEY, JSON.stringify(previous)); setSaveState('error'); notify(error instanceof Error ? error.message : 'Unable to save reader preferences.', 'error'); }
  }
  return <div className='grid gap-9 md:grid-cols-2 md:gap-x-10 md:gap-y-5'>
    <PreferenceGroup title='Theme' description='Change the appearance used throughout the application.'><ThemeToggle variant='account' initialSettings={settings} authenticated onThemeChange={(theme) => setSettings((current) => ({ ...current, theme }))} /></PreferenceGroup>
    <PreferenceGroup title='Reading background' description='Choose the canvas tone used behind chapter text.'><div className='grid grid-cols-4 gap-2'>{backgrounds.map((item) => <button key={item.id} onClick={() => update('background', item.id)} className={`border p-1 cursor-pointer ${settings.background === item.id ? 'border-foreground' : 'border-foreground/10'}`}><span className='block h-7 md:h-6 border border-black/10' style={{ background: item.color }} /><span className='block font-inter text-[9px] mt-1 mb-0.5'>{item.label}</span></button>)}</div></PreferenceGroup>
    <PreferenceGroup title='Type size' description={`Chapter text is currently ${settings.fontSize}px.`}><div className='flex flex-wrap gap-2'>{fontSizes.map((value) => <button key={value} onClick={() => update('fontSize', value)} className={`size-10 border font-inter text-xs cursor-pointer ${settings.fontSize === value ? 'bg-foreground text-background border-foreground' : 'border-foreground/15'}`}>{value}</button>)}</div></PreferenceGroup>
    <PreferenceGroup title='Line spacing' description={`Current line height is ${settings.lineHeight}.`}><div className='grid grid-cols-5 gap-2 max-w-md'>{lineHeights.map((value) => <button key={value} onClick={() => update('lineHeight', value)} className={`h-10 border font-inter text-xs cursor-pointer ${settings.lineHeight === value ? 'bg-foreground text-background border-foreground' : 'border-foreground/15'}`}>{value}</button>)}</div></PreferenceGroup>
    <p role='status' className={`font-inter text-[11px] font-extralight md:col-span-2 ${saveState === 'error' ? 'text-red-500' : 'opacity-55'}`}>{saveState === 'saving' ? 'Saving changes…' : saveState === 'error' ? 'Changes could not be saved.' : 'Changes are saved automatically to your account and applied in the chapter reader.'}</p>
  </div>;
}
function PreferenceGroup({ title, description, children }: { title: string; description: string; children: React.ReactNode }) { return <section className='border-t border-foreground/10 pt-5 md:pt-3'><div className='mb-5 md:mb-3'><h3 className='font-lora text-xl md:text-lg'>{title}</h3><p className='font-inter text-xs font-extralight mt-2 md:mt-1 opacity-65'>{description}</p></div>{children}</section>; }
