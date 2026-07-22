'use client';
import { useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import { READER_SETTINGS_STORAGE_KEY } from '@/lib/constants';
import type { ReaderBackground, ReaderSettings } from '@/types/reader';

const backgrounds:{id:ReaderBackground;label:string;color:string}[]=[{id:'paper',label:'Paper',color:'#f7f4ed'},{id:'white',label:'White',color:'#ffffff'},{id:'warm',label:'Warm',color:'#fbf1df'},{id:'sepia',label:'Sepia',color:'#efe0c8'},{id:'sage',label:'Sage',color:'#eef3ea'},{id:'mist',label:'Mist',color:'#eef2f5'},{id:'charcoal',label:'Charcoal',color:'#202020'},{id:'black',label:'Black',color:'#050505'}];
const fontSizes=[15,16,17,18,19,20,22,24,26];
const lineHeights=[1.4,1.55,1.7,1.85,2];

export default function AccountPreferences({initialSettings}:{initialSettings:ReaderSettings}){const[settings,setSettings]=useState(initialSettings);function update<K extends keyof ReaderSettings>(key:K,value:ReaderSettings[K]){const next={...settings,[key]:value};setSettings(next);localStorage.setItem(READER_SETTINGS_STORAGE_KEY,JSON.stringify(next));fetch('/api/settings',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(next)})}return <div className='space-y-9'>
  <PreferenceGroup title='Theme' description='Change the appearance used throughout the application.'><ThemeToggle variant='account' initialSettings={settings} authenticated onThemeChange={(theme)=>setSettings((current)=>({...current,theme}))}/></PreferenceGroup>
  <PreferenceGroup title='Reading background' description='Choose the canvas tone used behind chapter text.'><div className='grid grid-cols-4 sm:grid-cols-8 gap-3'>{backgrounds.map((item)=><button key={item.id} onClick={()=>update('background',item.id)} className={`border p-1 cursor-pointer ${settings.background===item.id?'border-foreground':'border-foreground/10'}`}><span className='block h-9 border border-black/10' style={{background:item.color}}/><span className='block font-inter text-[9px] mt-2 mb-1'>{item.label}</span></button>)}</div></PreferenceGroup>
  <PreferenceGroup title='Type size' description={`Chapter text is currently ${settings.fontSize}px.`}><div className='flex flex-wrap gap-2'>{fontSizes.map((value)=><button key={value} onClick={()=>update('fontSize',value)} className={`size-10 border font-inter text-xs cursor-pointer ${settings.fontSize===value?'bg-foreground text-background border-foreground':'border-foreground/15'}`}>{value}</button>)}</div></PreferenceGroup>
  <PreferenceGroup title='Line spacing' description={`Current line height is ${settings.lineHeight}.`}><div className='grid grid-cols-5 gap-2 max-w-md'>{lineHeights.map((value)=><button key={value} onClick={()=>update('lineHeight',value)} className={`h-10 border font-inter text-xs cursor-pointer ${settings.lineHeight===value?'bg-foreground text-background border-foreground':'border-foreground/15'}`}>{value}</button>)}</div></PreferenceGroup>
  <p className='font-inter text-[11px] font-extralight opacity-55'>Changes are saved automatically to your account and applied in the chapter reader.</p>
  </div>}

function PreferenceGroup({title,description,children}:{title:string;description:string;children:React.ReactNode}){return <section className='border-t border-foreground/10 pt-5'><div className='mb-5'><h3 className='font-lora text-xl'>{title}</h3><p className='font-inter text-xs font-extralight mt-2 opacity-65'>{description}</p></div>{children}</section>}
