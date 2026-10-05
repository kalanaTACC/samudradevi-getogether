var TICKET_LINK = "https://forms.gle/WwF3SUoeWAA429jK7";
document.querySelector("#tickets .tbg img").src = document.querySelector("#hero .bg").src;
document.body.classList.add("lock");
var secObs=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("active");if(e.target.id==="tickets")countUp();secObs.unobserve(e.target)}})},{threshold:.15});
document.querySelectorAll(".view").forEach(function(s){secObs.observe(s)});

function playDoor(){
  var hero = document.getElementById("hero");
  hero.querySelectorAll(".portal,.lightgap,.seal,.glow,.bg,.hlogo,.frame,.title *").forEach(function(el){
    el.style.animation="none"; void el.offsetWidth; el.style.animation="";
  });
}
document.getElementById("replay").onclick = playDoor;

var toast = document.getElementById("toast");
document.getElementById("buy").onclick = function(){
  if (TICKET_LINK) { window.open(TICKET_LINK, "_blank", "noopener"); return; }
  toast.textContent = "Ticket booking opens soon. Check back here.";
  toast.classList.add("on"); setTimeout(function(){ toast.classList.remove("on"); }, 3200);
};

var target = new Date("2026-11-15T09:00:00+05:30").getTime();
function setV(id,v){var e=document.getElementById(id);if(e.textContent!==String(v)){e.textContent=v;e.classList.remove("pop");void e.offsetWidth;e.classList.add("pop")}}
function tick(){
  var t = Math.max(0, target - Date.now());
  setV("c-d",Math.floor(t/864e5));setV("c-h",Math.floor(t%864e5/36e5));
  setV("c-m",Math.floor(t%36e5/6e4));setV("c-s",Math.floor(t%6e4/1e3));
}
tick(); setInterval(tick,1000);

// ticket tilt
var tk = document.getElementById("ticket");
tk.parentNode.addEventListener("pointermove", function(e){
  var r = tk.getBoundingClientRect(), x = (e.clientX-r.left)/r.width-.5, y = (e.clientY-r.top)/r.height-.5;
  tk.style.transform = "rotateY("+x*14+"deg) rotateX("+(-y*14)+"deg)";
});
tk.parentNode.addEventListener("pointerleave", function(){ tk.style.transform=""; });

// embers
(function(){
  var c=document.getElementById("embers"),x=c.getContext("2d"),P=[],W,H;
  function size(){W=c.width=c.offsetWidth;H=c.height=c.offsetHeight}
  size(); window.addEventListener("resize",size);
  for(var i=0;i<46;i++)P.push({x:Math.random(),y:Math.random(),r:1+Math.random()*2.6,v:.15+Math.random()*.5,s:Math.random()*6});
  (function loop(t){
    x.clearRect(0,0,W,H);
    P.forEach(function(p){
      p.y-=p.v/H*2.2; if(p.y<-.05){p.y=1.05;p.x=Math.random()}
      var px=(p.x+Math.sin(t/1800+p.s)*.012)*W,py=p.y*H,g=x.createRadialGradient(px,py,0,px,py,p.r*4);
      g.addColorStop(0,"rgba(255,214,130,.95)");g.addColorStop(1,"rgba(232,137,47,0)");
      x.fillStyle=g;x.beginPath();x.arc(px,py,p.r*4,0,6.283);x.fill();
    });
    requestAnimationFrame(loop);
  })(0);
})();
// background music: starts on first tap (browsers block autoplay), toggle any time
var bgm=document.getElementById("bgm"),mb=document.getElementById("music"),muted=false,fade;
function setM(on){
  mb.classList.toggle("on",on);mb.setAttribute("aria-pressed",on);document.getElementById("mlabel").textContent=on?"Music on":"Play music";
}
function playM(){
  bgm.volume=0;var p=bgm.play();
  if(p&&p.then)p.then(function(){setM(true);clearInterval(fade);fade=setInterval(function(){bgm.volume=Math.min(.7,bgm.volume+.05);if(bgm.volume>=.7)clearInterval(fade)},150)}).catch(function(){setM(false)});
}
function pauseM(){bgm.pause();setM(false)}
mb.onclick=function(e){e.stopPropagation();if(bgm.paused){muted=false;playM()}else{muted=true;pauseM()}};
function enter(){
  document.getElementById("gate").classList.add("out");document.body.classList.remove("lock");
  document.getElementById("hero").classList.remove("wait");
  if(!muted)playM();
  aStart();
}
document.getElementById("enter").onclick=enter;
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.style.transitionDelay=(Array.prototype.indexOf.call(e.target.parentNode.children,e.target)%4)*.12+"s";e.target.classList.add("on");io.unobserve(e.target)}})},{threshold:.15});
document.querySelectorAll(".rv").forEach(function(el){io.observe(el)});
function countUp(){var e=document.getElementById("pn"),t0=null;function f(t){if(t0===null)t0=t;var p=Math.min(1,(t-t0)/1600);e.textContent=Math.round(8000*(1-Math.pow(1-p,3))).toLocaleString("en-US");if(p<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
// angel guide
var TIPS={
 hero:[["Hi! I'm your little guide. Scroll down to see everything.",null],["Tap here to jump to your tickets.","#home .btns .gold"],["Curious what's planned? Tap here.","#home .btns .ghost"]],
 info:[["15 November 2026, 9 AM to 3 PM, at the Grand Ballroom, Green Court, Homagama.",".details"],["Keep scrolling to see what's on that day.",null]],
 program:[["Pageant, DJ Shaggy, lunch and a photobooth, all in one day!",".prog"],["Ready? Your ticket is just below.",null]],
 tickets:[["One ticket covers the whole day. LKR 8,000.",".ticket"],["Tap the gold button to open the booking form.","#buy"]],
 pay:[["The bank details for your ticket payment are here.",".bank"]],
 contact:[["Need help? Tap a number to call.",".contacts"],["Website or booking form trouble? Call these two.",".tech"]]};
var aEl=document.getElementById("angel"),aBub=document.getElementById("abub"),aTxt=document.getElementById("atxt"),aRing=document.getElementById("aring"),aSet="",aI=0,aTarget=null,aTimer,aOn=false;
function aSetKey(){var mid=innerHeight*.5,k="tickets";[["pay","pay"],["contact","contact"]].forEach(function(p){var el=document.getElementById(p[0]);if(el&&el.getBoundingClientRect().top<mid)k=p[1]});return k}
function aShow(){
  var L=TIPS[aSet],t=L[aI%L.length];
  aTxt.textContent=t[0];aTarget=t[1]?document.querySelector(t[1]):null;
  aBub.classList.remove("off","pop");void aBub.offsetWidth;aBub.classList.add("pop");
}
function aNext(){aI++;aShow();clearInterval(aTimer);aTimer=setInterval(function(){if(!aBub.classList.contains("off")){aI++;aShow()}},7000)}
function aSync(){
  if(!aOn)return;
  var s=document.getElementById("tickets").getBoundingClientRect(),vis=s.top<innerHeight*.55&&s.bottom>innerHeight*.3;
  if(!vis){if(aEl.classList.contains("on")){aEl.classList.remove("on");aTarget=null;aSet="";clearInterval(aTimer)}return}
  if(!aEl.classList.contains("on"))aEl.classList.add("on");
  var k=aSetKey();
  if(k!==aSet){aSet=k;aI=0;aShow();clearInterval(aTimer);aTimer=setInterval(function(){if(!aBub.classList.contains("off")){aI++;aShow()}},7000)}
}
function aStart(){aOn=true;aSync()}
document.getElementById("ab").onclick=function(){if(aBub.classList.contains("off")){aShow()}else{aNext()}};
document.getElementById("ax").onclick=function(e){e.stopPropagation();aBub.classList.add("off");aTarget=null};
addEventListener("scroll",aSync,{passive:true});addEventListener("hashchange",function(){setTimeout(aSync,60)});
(function ring(){
  var r=aTarget&&!aBub.classList.contains("off")?aTarget.getBoundingClientRect():null;
  if(r&&r.width>0&&r.bottom>60&&r.top<innerHeight-40){aRing.style.opacity=1;aRing.style.left=r.left-6+"px";aRing.style.top=r.top-6+"px";aRing.style.width=r.width+12+"px";aRing.style.height=r.height+12+"px"}else aRing.style.opacity=0;
  requestAnimationFrame(ring);
})();
function say(m){toast.textContent=m;toast.classList.add("on");setTimeout(function(){toast.classList.remove("on")},2600)}
document.getElementById("copyacc").onclick=function(){var t="300076955518";if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(function(){say("Account number copied")},function(){say("Press and hold the number to copy")})}else say("Press and hold the number to copy")};
