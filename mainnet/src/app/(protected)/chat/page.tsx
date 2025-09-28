"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { AnimatePresence, motion } from "framer-motion";

/* -------------------- Rooms (English artists) -------------------- */
const ROOMS: { id: string; label: string; desc: string; emoji: string }[] = [
  { id: "taylor", label: "Taylor Swift", desc: "Storytelling pop & acoustic vibes", emoji: "🎤" },
  { id: "adele",  label: "Adele",        desc: "Soulful ballads & powerhouse vocals", emoji: "🎙" },
  { id: "edsheeran", label: "Ed Sheeran", desc: "Loop-pedal pop & cozy melodies", emoji: "🎸" },
  { id: "drake",  label: "Drake",        desc: "Moody rap & late-night feels", emoji: "🎧" },
];

type Msg = { id: string; user: string; text: string; ts: number; room: string };
type Phase = "name" | "rooms" | "chat";

const LS_KEY_NAME = "chat:nickname";
const LS_KEY_ROOM = "chat:room";
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

/* -------------------- Utils -------------------- */
function genId(): string {
  try { /* @ts-ignore */ if (typeof crypto !== "undefined" && crypto?.randomUUID) return crypto.randomUUID(); } catch {}
  try { /* @ts-ignore */ const c = crypto?.getRandomValues ? crypto : null;
    if (c) { const a = new Uint8Array(16); c.getRandomValues(a); a[6]=(a[6]&0x0f)|0x40; a[8]=(a[8]&0x3f)|0x80;
      const h=[...a].map(b=>b.toString(16).padStart(2,"0"));
      return `${h.slice(0,4).join("")}-${h.slice(4,6).join("")}-${h.slice(6,8).join("")}-${h.slice(8,10).join("")}-${h.slice(10).join("")}`;
    }
  } catch {}
  return "id-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2);
}
function hashHue(s: string){ let h=0; for(let i=0;i<s.length;i++) h=s.charCodeAt(i)+((h<<5)-h); return Math.abs(h)%360; }
function Avatar({ name }: { name: string }) {
  const hue = useMemo(()=>hashHue(name||"?"),[name]);
  const initial = (name?.trim()?.[0]||"?").toUpperCase();
  return (
    <div className="h-9 w-9 rounded-2xl grid place-items-center text-white text-sm font-semibold shadow"
      style={{background:`linear-gradient(135deg, hsl(${hue} 80% 50%), hsl(${(hue+40)%360} 80% 50%))`}}>
      {initial}
    </div>
  );
}
function Bubble({ msg, mine }: { msg: Msg; mine: boolean }) {
  const time = new Date(msg.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return (
    <motion.div initial={{opacity:0, y:6, scale:.98}} animate={{opacity:1, y:0, scale:1}}
      className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[80%] flex items-end gap-2">
        {!mine && <Avatar name={msg.user} />}
        <div className={`px-4 py-2 rounded-2xl shadow-sm
            ${mine ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-sm"
                   : "bg-white/70 backdrop-blur border rounded-bl-sm"}`}>
          <div className={`text-[10px] ${mine ? "text-blue-100/90" : "text-gray-500"} mb-1`}>
            {msg.user} · {time}
          </div>
          <div className="whitespace-pre-wrap break-words leading-relaxed">{msg.text}</div>
        </div>
        {mine && <Avatar name={msg.user} />}
      </div>
    </motion.div>
  );
}

/* -------------------- Step 1: Name -------------------- */
function NameStep({ onNext }: { onNext: (name: string) => void }) {
  const [name, setName] = useState("");
  return (
    <motion.div key="step-name" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
      className="mx-auto max-w-lg w-full mt-20">
      <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-8">
        <div className="absolute -top-6 left-6 h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white grid place-items-center shadow-lg">💬</div>
        <h1 className="text-2xl font-semibold text-white mb-2">Welcome to Music Community</h1>
        <p className="text-sm text-gray-300 mb-6">Choose a nickname to continue.</p>

        <div className="flex gap-2">
          <input autoFocus value={name} onChange={(e)=>setName(e.target.value.slice(0,24))}
            onKeyDown={(e)=>{ if(e.key==="Enter" && name.trim()) onNext(name.trim()); }}
            placeholder="e.g., Nova" className="flex-1 rounded-2xl border border-white/15 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 text-white placeholder-gray-400"/>
          <motion.button whileTap={{scale:.98}} onClick={()=>name.trim()&&onNext(name.trim())}
            disabled={!name.trim()}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold disabled:opacity-40 shadow">
            Continue
          </motion.button>
        </div>
        <p className="text-xs text-gray-400 mt-3">You can change it later in the chat header.</p>
      </div>
    </motion.div>
  );
}

/* -------------------- Step 2: Room Cards -------------------- */
function RoomsStep({ onPick }: { onPick: (roomId: string) => void }) {
  return (
    <motion.div key="step-rooms" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
      className="mx-auto max-w-6xl w-full mt-14">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-white">Choose a room</h2>
        <p className="text-sm text-gray-300">Pick a vibe. You can switch rooms anytime.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ROOMS.map((r,i)=>(
          <motion.button key={r.id} onClick={()=>onPick(r.id)}
            initial={{opacity:0, y:12}} animate={{opacity:1, y:0, transition:{delay:i*0.05}}}
            whileHover={{y:-4, scale:1.02}} whileTap={{scale:.98}}
            className="group text-left rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-5 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 grid place-items-center text-xl">{r.emoji}</div>
              <div>
                <div className="font-semibold text-white">{r.label}</div>
                <div className="text-xs text-gray-400">{r.desc}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-blue-400 text-sm">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">Join room</span>
              <svg className="h-4 w-4 translate-x-0 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

/* -------------------- Step 3: Chat -------------------- */
function ChatStep({
  nickname, setNickname, room, setRoom, socketRef,
}: {
  nickname: string; setNickname: (v: string)=>void;
  room: string; setRoom: (v: string)=>void;
  socketRef: React.MutableRefObject<Socket|null>;
}) {
  const [online, setOnline] = useState(0);
  const [typing, setTyping] = useState("");
  const [text, setText] = useState("");

  const [msgsByRoom, setMsgsByRoom] = useState<Record<string, Msg[]>>({});
  const msgs = msgsByRoom[room] || [];

  const [status, setStatus] =
    useState<"connecting"|"connected"|"reconnecting"|"disconnected">("connecting");

  const listRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<any>(null);
  const lastTypingSentAt = useRef(0);

  useEffect(()=>{ const el=listRef.current; if(el) el.scrollTop=el.scrollHeight; },[msgs]);

  useEffect(()=>{
    const socket = io(SOCKET_URL, {
      transports:["websocket","polling"], withCredentials:true, autoConnect:true,
      reconnection:true, reconnectionAttempts:Infinity, reconnectionDelay:500, reconnectionDelayMax:5000,
    });
    socketRef.current = socket;

    socket.on("connect", ()=>{
      setStatus("connected");
      socket.emit("join",{ room, name: localStorage.getItem(LS_KEY_NAME)||"Guest" });
    });
    socket.on("disconnect", ()=>setStatus("disconnected"));
    socket.io.on("reconnect_attempt", ()=>setStatus("reconnecting"));
    socket.io.on("reconnect", ()=>setStatus("connected"));

    socket.on("online", (n:number)=>setOnline(n));
    socket.on("message", (msg:Msg)=>{
      setMsgsByRoom(prev=>({...prev, [msg.room]: [...(prev[msg.room]||[]), msg]}));
    });
    socket.on("typing", ({name}:{name:string})=>{
      setTyping(`${name} is typing…`); clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(()=>setTyping(""), 900);
    });

    return ()=>{ socket.close(); socketRef.current=null; };
  },[]);

  useEffect(()=>{
    localStorage.setItem(LS_KEY_ROOM, room);
    if (socketRef.current?.connected) socketRef.current.emit("switchRoom",{room});
    setOnline(0);
  },[room]);

  useEffect(()=>{
    if (nickname) localStorage.setItem(LS_KEY_NAME, nickname);
    if (socketRef.current?.connected) socketRef.current.emit("setName",{name:nickname});
  },[nickname]);

  const send = ()=>{
    const trimmed = text.trim(); if (!trimmed || !socketRef.current) return;
    const msg: Msg = { id: genId(), user: nickname||"Guest", text: trimmed, ts: Date.now(), room };
    socketRef.current.emit("message", msg);
    setMsgsByRoom(prev=>({...prev, [room]: [...(prev[room]||[]), msg]}));
    setText("");
  };
  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>)=>{
    if (e.key==="Enter" && !e.shiftKey){ e.preventDefault(); send(); return; }
    const now=Date.now(); if (socketRef.current && now-lastTypingSentAt.current>400){
      lastTypingSentAt.current = now; socketRef.current.emit("typing",{name:nickname, room});
    }
  };

  return (
    <motion.div key="step-chat" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
      className="min-h-dvh flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur bg-black/80 border-b border-white/10">
        <div className="max-w-6xl mx-auto p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white grid place-items-center font-semibold shadow">💬</div>
            <div className="text-sm text-gray-300">
              Room: <span className="font-medium text-white">{ROOMS.find(r=>r.id===room)?.label}</span> ·{" "}
              <span className="tabular-nums">{online}</span> online ·{" "}
              <span className={`${
                status === "connecting" ? "text-amber-400" : 
                status === "connected" ? "text-green-400" :
                status === "reconnecting" ? "text-amber-400" : 
                "text-red-400"
              }`}>{status}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select value={room} onChange={(e)=>setRoom(e.target.value)}
              className="rounded-2xl border border-white/15 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 text-white">
              {ROOMS.map(r=> <option key={r.id} value={r.id} className="bg-black">{r.label}</option>)}
            </select>
            <input value={nickname} onChange={(e)=>setNickname(e.target.value.slice(0,24))}
              className="rounded-2xl border border-white/15 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 w-44 bg-white/10 text-white placeholder-gray-400"
              placeholder="Your nickname"/>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 max-w-6xl mx-auto w-full p-4">
        <div ref={listRef}
          className="h-[66vh] md:h-[70vh] overflow-y-auto space-y-3 rounded-3xl p-5 border border-white/10 bg-white/5 backdrop-blur shadow-xl">
          <AnimatePresence initial={false}>
            {msgs.map((m)=> <Bubble key={m.id} msg={m} mine={m.user===nickname}/>)}
          </AnimatePresence>
        </div>

        {/* Composer */}
        <div className="mt-3">
          <div className="flex items-end gap-2">
            <textarea value={text} onChange={(e)=>setText(e.target.value)} onKeyDown={handleKey} rows={1}
              placeholder="Write a message… (Shift+Enter = newline)"
              className="flex-1 resize-none rounded-3xl border border-white/15 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 text-white placeholder-gray-400"/>
            <motion.button whileTap={{scale:.98}} onClick={send}
              disabled={!text.trim() || status!=="connected"}
              className="rounded-3xl px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold disabled:opacity-40 shadow">
              Send
            </motion.button>
          </div>
          <div className="h-6 mt-1 text-xs text-gray-400">{typing}</div>
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------- Top-level Flow with background blobs -------------------- */
function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full blur-3xl opacity-30"
           style={{background:"radial-gradient(closest-side, rgba(59,130,246,.6), transparent)"}}/>
      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full blur-3xl opacity-30"
           style={{background:"radial-gradient(closest-side, rgba(37,99,235,.6), transparent)"}}/>
    </div>
  );
}

export default function ChatFlowPage() {
  const [phase, setPhase] = useState<Phase>(()=> (typeof window !== "undefined" && localStorage.getItem(LS_KEY_NAME)) ? "rooms" : "name");
  const [nickname, setNickname] = useState<string>(()=> (typeof window !== "undefined" ? localStorage.getItem(LS_KEY_NAME) || "" : ""));
  const [room, setRoom] = useState<string>(()=> (typeof window !== "undefined" ? localStorage.getItem(LS_KEY_ROOM) || ROOMS[0].id : ROOMS[0].id));
  const socketRef = useRef<Socket|null>(null);

  const named = (n:string)=>{ setNickname(n); localStorage.setItem(LS_KEY_NAME,n); setPhase("rooms"); };
  const picked = (rid:string)=>{ setRoom(rid); localStorage.setItem(LS_KEY_ROOM,rid); setPhase("chat"); };

  return (
    <div className="min-h-dvh relative bg-gradient-to-br from-neutral-950 via-slate-900/30 to-neutral-950 text-white">
      <Background/>
      <AnimatePresence mode="wait">
        {phase==="name"  && <NameStep  key="name"  onNext={named} />}
        {phase==="rooms" && <RoomsStep key="rooms" onPick={picked} />}
        {phase==="chat"  && <ChatStep  key="chat" nickname={nickname} setNickname={setNickname} room={room} setRoom={setRoom} socketRef={socketRef} />}
      </AnimatePresence>
    </div>
  );
}