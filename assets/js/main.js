document.addEventListener('DOMContentLoaded',function(){
  var toggle=document.querySelector('.nav-toggle');
  var links=document.querySelector('.nav-links');
  var profileBtn=document.getElementById('profile-btn');
  var profileMenu=document.getElementById('profile-menu');
  if(toggle&&links){
    toggle.addEventListener('click',function(){
      links.classList.toggle('open');
    });
  }
  if(profileBtn){ profileBtn.addEventListener('click', function(){ if(profileMenu){ profileMenu.classList.toggle('open'); } }); }
  function setProfileBadge(nameOrId){ if(profileBtn){ var label=(nameOrId||'').trim(); var ch=(label.match(/[A-Za-z0-9]/)&&label.match(/[A-Za-z0-9]/)[0]||'U').toUpperCase(); profileBtn.textContent=ch; } }
  var path=window.location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav-links a').forEach(function(a){
    var href=a.getAttribute('href');
    if(href===path){ a.classList.add('active'); }
  });
  if(window.AOS){ AOS.init({ once:true, duration:700, offset:60 }); }
  var fontInc=document.getElementById('font-inc');
  var fontDec=document.getElementById('font-dec');
  var zoomVal=parseFloat(localStorage.getItem('smartmed.zoom')||'1'); if(!(zoomVal>0)) zoomVal=1; document.body.style.zoom=zoomVal; if(fontInc){ fontInc.addEventListener('click',function(){ zoomVal=Math.min(1.6, Math.round((zoomVal+0.1)*10)/10); localStorage.setItem('smartmed.zoom', String(zoomVal)); document.body.style.zoom=zoomVal; }); } if(fontDec){ fontDec.addEventListener('click',function(){ zoomVal=Math.max(0.8, Math.round((zoomVal-0.1)*10)/10); localStorage.setItem('smartmed.zoom', String(zoomVal)); document.body.style.zoom=zoomVal; }); }
  var settingsBtn=document.getElementById('settings-btn');
  var settingsMenu=document.getElementById('settings-menu');
  var fontInput=document.getElementById('font-input');
  var fontPlus=document.getElementById('font-plus');
  var fontMinus=document.getElementById('font-minus');
  if(settingsBtn){ settingsBtn.addEventListener('click', function(){ if(settingsMenu){ settingsMenu.classList.toggle('open'); } }); }
  function setZoom(z){ zoomVal=z; localStorage.setItem('smartmed.zoom', String(zoomVal)); document.body.style.zoom=zoomVal; if(fontInput){ fontInput.value=Math.round(zoomVal*100)+'%'; } }
  if(fontInput){ fontInput.value=Math.round(zoomVal*100)+'%'; fontInput.addEventListener('change', function(){ var v=(fontInput.value||'').trim(); var n=parseFloat(v.replace('%','')); if(!(n>0)) return; n=Math.max(80, Math.min(160, n)); setZoom(Math.round(n)/100); }); }
  if(fontPlus){ fontPlus.addEventListener('click', function(){ setZoom(Math.min(1.6, Math.round((zoomVal+0.1)*10)/10)); }); }
  if(fontMinus){ fontMinus.addEventListener('click', function(){ setZoom(Math.max(0.8, Math.round((zoomVal-0.1)*10)/10)); }); }
  var themeLight=document.getElementById('theme-light');
  var themeDark=document.getElementById('theme-dark');
  var theme=localStorage.getItem('smartmed.theme')||'light';
  document.documentElement.setAttribute('data-theme', theme);
  function setTheme(t){ theme=t; localStorage.setItem('smartmed.theme', t); document.documentElement.setAttribute('data-theme', t); }
  if(themeLight){ themeLight.addEventListener('click', function(){ setTheme('light'); }); }
  if(themeDark){ themeDark.addEventListener('click', function(){ setTheme('dark'); }); }
  var getStarted=document.getElementById('get-started-overlay');
  var loginEmail=document.getElementById('login-email');
  var loginPhone=document.getElementById('login-phone');
  var sendOtp=document.getElementById('send-otp');
  var otpInput=document.getElementById('otp-input');
  var verifyOtp=document.getElementById('verify-otp');
  var otpBanner=document.getElementById('otp-banner');
  var loginStatus=document.getElementById('login-status');
  var startBtn=document.getElementById('start-btn');
  var loginCard=document.getElementById('login-card');
  function showOverlay(flag){ if(getStarted){ getStarted.style.display=flag?'flex':'none'; } }
  function readUser(){ try{ return JSON.parse(localStorage.getItem('smartmed.user')||'null'); }catch(e){ return null; } }
  function writeUser(obj){ localStorage.setItem('smartmed.user', JSON.stringify(obj||{})); }
  function clearUser(){ localStorage.removeItem('smartmed.user'); }
  function genOTP(){ return String(Math.floor(100000+Math.random()*900000)); }
  function writeOTP(obj){ localStorage.setItem('smartmed.otp', JSON.stringify(obj)); }
  function readOTP(){ try{ return JSON.parse(localStorage.getItem('smartmed.otp')||'null'); }catch(e){ return null; } }
  var user=readUser(); if(user && user.verifiedAt){ showOverlay(false); setProfileBadge(user.id); if(profileMenu){ var label=document.getElementById('profile-label'); if(label) label.textContent='Logged in as '+(user.id||''); } } else { showOverlay(true); }
  function updateAuthUI(){ var links=[].slice.call(document.querySelectorAll('a[href="get-started.html"]')); var logged=!!(user && user.verifiedAt); links.forEach(function(a){ a.style.display=logged?'none':''; }); }
  updateAuthUI();
  var logoutBtn=document.getElementById('logout-btn');
  if(logoutBtn){ logoutBtn.addEventListener('click', function(){ clearUser(); setProfileBadge(''); if(profileMenu){ profileMenu.classList.remove('open'); var label=document.getElementById('profile-label'); if(label) label.textContent='Not logged in'; } var cur=(window.location.pathname.split('/').pop()||''); if(cur!=='get-started.html'){ window.location.href='get-started.html'; } }); }
  if(startBtn && loginCard){ startBtn.addEventListener('click', function(){ loginCard.classList.remove('hide'); startBtn.style.display='none'; }); }
  if(user && user.verifiedAt){ var curPath=(window.location.pathname.split('/').pop()||''); if(curPath==='get-started.html'){ window.location.href='index.html'; } }
  function resolveTarget(){ var email=(loginEmail&&loginEmail.value||'').trim(); var phone=(loginPhone&&loginPhone.value||'').trim(); if(phone){ return { type:'phone', id:phone }; } if(email){ return { type:'email', id:email }; } return null; }
  function validTarget(t){ if(!t) return false; if(t.type==='phone'){ return /^\+?[0-9]{8,15}$/.test(t.id); } if(t.type==='email'){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t.id); } return false; }
  if(sendOtp){ sendOtp.addEventListener('click', function(){ var t=resolveTarget(); if(!validTarget(t)){ alert('Enter a valid phone or email'); return; } var code=genOTP(); var obj={ target:t, code:code, expires:Date.now()+5*60*1000 }; writeOTP(obj); if(otpBanner){ otpBanner.textContent='OTP sent to '+t.id+' • '+code; otpBanner.style.display='block'; setTimeout(function(){ otpBanner.style.display='none'; }, 8000); } if(loginStatus){ loginStatus.textContent='OTP sent'; } }); }
  if(verifyOtp){ verifyOtp.addEventListener('click', function(){ var rec=readOTP(); var val=(otpInput&&otpInput.value||'').trim(); if(!rec||!val){ alert('Enter OTP'); return; } if(Date.now()>rec.expires){ alert('OTP expired'); return; } if(val!==rec.code){ alert('Invalid OTP'); return; } var id=rec.target.id; var obj={ id:id, type:rec.target.type, verifiedAt:new Date().toISOString() }; writeUser(obj); user=obj; setProfileBadge(id); showOverlay(false); if(profileMenu){ var label=document.getElementById('profile-label'); if(label) label.textContent='Logged in as '+id; } if(loginStatus){ loginStatus.textContent='Logged in'; } updateAuthUI(); var p=(window.location.pathname.split('/').pop()||''); if(p==='get-started.html'){ window.location.href='index.html'; } }); }
  var form=document.getElementById('demo-form');
  var addTime=document.getElementById('add-time');
  var timeList=document.getElementById('time-list');
  var scheduleList=document.getElementById('schedule-list');
  var medName=document.getElementById('med-name');
  var dosage=document.getElementById('dosage');
  var reminderApp=document.getElementById('rem-app');
  var reminderSms=document.getElementById('rem-sms');
  var reminderWa=document.getElementById('rem-wa');
  var startDate=document.getElementById('start-date');
  var historyList=document.getElementById('history-list');
  var rxFile=document.getElementById('rx-file');
  var rxScan=document.getElementById('rx-scan');
  var rxStatus=document.getElementById('rx-status');
  var rxResults=document.getElementById('rx-results');
  var alertsLog=document.getElementById('alerts-log');
  var scheduleToggle=document.getElementById('schedule-toggle');
  var historyToggle=document.getElementById('history-toggle');
  var alertsToggle=document.getElementById('alerts-toggle');
  var scanToggle=document.getElementById('scan-toggle');
  var clearHistoryBtn=document.getElementById('clear-history');
  var clearAlertsBtn=document.getElementById('clear-alerts');
  var stockTabletsInput=document.getElementById('stock-tablets');
  var stockMlInput=document.getElementById('stock-ml');
  var patientNameInput=document.getElementById('patient-name');
  var patientMobileInput=document.getElementById('patient-mobile');
  var refillMedSelect=document.getElementById('refill-med');
  var refillTabsInput=document.getElementById('refill-tabs');
  var refillMlInput=document.getElementById('refill-ml');
  var markRefillBtn=document.getElementById('mark-refill');
  var refillList=document.getElementById('refill-list');
  var refillHistoryToggle=document.getElementById('refill-history-toggle');
  var clearRefillBtn=document.getElementById('clear-refill');
  var emerRefillList=document.getElementById('emer-refill-list');
  var emerRefillToggle=document.getElementById('emer-refill-toggle');
  var emerFam1Name=document.getElementById('emer-fam1-name');
  var emerFam1Mobile=document.getElementById('emer-fam1-mobile');
  var emerFam2Name=document.getElementById('emer-fam2-name');
  var emerFam2Mobile=document.getElementById('emer-fam2-mobile');
  var emerCareName=document.getElementById('emer-care-name');
  var emerCareMobile=document.getElementById('emer-care-mobile');
  var emerBtn=document.getElementById('emergency-btn');
  var emerBanner=document.getElementById('emergency-banner');
  var defaultTimes={ morning:'08:00', noon:'12:00', afternoon:'14:00', evening:'19:00', night:'21:00' };
  var currentMed=null;
  var alarmState={ audio:null, interval:null, active:false, timeouts:[] };
  function startAlarm(label){
    if(!alarmState.audio){
      var Ctx=window.AudioContext||window.webkitAudioContext; if(!Ctx){ return; }
      var ctx=new Ctx(); var osc=ctx.createOscillator(); var gain=ctx.createGain();
      osc.type='sine'; osc.frequency.setValueAtTime(850, ctx.currentTime);
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      osc.connect(gain).connect(ctx.destination); osc.start();
      alarmState.audio={ ctx:ctx, osc:osc, gain:gain };
      alarmState.interval=setInterval(function(){
        var on=alarmState.audio.gain.gain.value<0.01;
        alarmState.audio.gain.gain.linearRampToValueAtTime(on?0.08:0.001, alarmState.audio.ctx.currentTime+0.05);
      },500);
    }
    alarmState.active=true;
    var host=document.querySelector('.schedule');
    if(host){
      var banner=document.getElementById('alarm-banner');
      if(!banner){
        banner=document.createElement('div');
        banner.id='alarm-banner';
        banner.className='alarm-banner';
        var text=document.createElement('div'); text.id='alarm-text'; banner.appendChild(text);
        var stopBtn=document.createElement('button'); stopBtn.className='btn'; stopBtn.textContent='Stop Alarm';
        stopBtn.addEventListener('click',function(){ var cur=alarmState.current; stopAlarm(); banner.remove(); if(cur && cur.day && cur.dose && cur.med){ cur.dose.stoppedAt=Date.now(); setTimeout(function(){ if(cur.day.doses.indexOf(cur.dose)!==-1){ sendAlerts(cur.med, cur.day.date, cur.dose.time); } }, 30*60*1000); } });
        banner.appendChild(stopBtn);
        host.insertBefore(banner, host.firstChild);
      }
      var textEl=document.getElementById('alarm-text'); if(textEl){ textEl.textContent='Alarm '+label; }
    }
  }
  function stopAlarm(){
    if(alarmState.audio){
      try{ alarmState.audio.osc.stop(); }catch(e){}
      alarmState.audio.osc.disconnect(); alarmState.audio.gain.disconnect();
      alarmState.audio=null;
    }
    if(alarmState.interval){ clearInterval(alarmState.interval); alarmState.interval=null; }
    alarmState.active=false;
  }
  function parseDateTime(dateISO, timeHHMM){
    var parts=timeHHMM.split(':'); var d=new Date(dateISO+'T'+parts[0].padStart(2,'0')+':'+parts[1].padStart(2,'0')+':00');
    return d;
  }
  function msUntil(dateObj){ return dateObj.getTime()-Date.now(); }
  function persistCurrentMed(){ if(!currentMed) return; var meds=loadLS('smartmed.meds'); for(var i=0;i<meds.length;i++){ if(meds[i].id===currentMed.id){ meds[i]=currentMed; break; } } saveLS('smartmed.meds', meds); }
  function scheduleAlarms(schedule, medObj){
    schedule.forEach(function(day,di){ day.doses.forEach(function(d,ti){ if(d.status==='taken') return; var target=parseDateTime(day.date,d.time); var delta=msUntil(target); if(delta>0 && delta<24*60*60*1000){ var tid=setTimeout(function(){
            var row=scheduleList&&scheduleList.querySelector('[data-di="'+di+'"][data-ti="'+ti+'"]');
            if(row){ row.classList.add('ringing'); var stop=document.createElement('button'); stop.className='btn'; stop.textContent='Stop Alarm'; stop.addEventListener('click',function(){ stopAlarm(); row.classList.remove('ringing'); this.remove();
                d.stoppedAt=Date.now(); setTimeout(function(){ if(day.doses.indexOf(d)!==-1){ sendAlerts(medObj, day.date, d.time); } }, 30*60*1000);
              }); row.appendChild(stop); }
            alarmState.current={ med:medObj, day:day, dose:d };
            startAlarm((medObj&&medObj.name||'Medicine')+' '+d.time);
          }, delta); alarmState.timeouts.push(tid); }
    }); });
  }
  function clearScheduledAlarms(){
    stopAlarm();
    var banner=document.getElementById('alarm-banner'); if(banner){ try{ banner.remove(); }catch(e){} }
    if(alarmState.timeouts && alarmState.timeouts.length){ alarmState.timeouts.forEach(function(t){ try{ clearTimeout(t); }catch(e){} }); alarmState.timeouts=[]; }
    if(scheduleList){ scheduleList.innerHTML=''; }
    var meds=loadLS('smartmed.meds'); meds.forEach(function(m){ m.schedule=[]; }); saveLS('smartmed.meds', meds);
  }
  function pad(n){ return n.toString().padStart(2,'0'); }
  function todayISO(){ var d=new Date(); return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate()); }
  function readTimes(){ var times=[]; if(!timeList) return times; timeList.querySelectorAll('input[type="time"]').forEach(function(t){ if(t.value) times.push(t.value); }); return times; }
  function addTimeInput(value){ if(!timeList) return; var input=document.createElement('input'); input.type='time'; input.className='time-input'; if(value) input.value=value; timeList.appendChild(input); }
  function loadLS(key){ try{ return JSON.parse(localStorage.getItem(key)||'[]'); }catch(e){ return []; } }
  function saveLS(key,val){ localStorage.setItem(key, JSON.stringify(val)); }
  function generateSchedule(start, times){ var out=[]; var startObj=start?new Date(start):new Date(); for(var i=0;i<7;i++){ var day=new Date(startObj.getTime()); day.setDate(startObj.getDate()+i); var dayISO=day.getFullYear()+"-"+pad(day.getMonth()+1)+"-"+pad(day.getDate()); var doses=times.map(function(t){ return { time:t, status:'pending' }; }); out.push({ date:dayISO, doses:doses }); } return out; }
  function renderSchedule(schedule){ if(!scheduleList) return; scheduleList.innerHTML=''; schedule.forEach(function(day,di){ var wrap=document.createElement('div'); wrap.className='schedule-day'; var title=document.createElement('div'); title.className='pill'; title.textContent=day.date; wrap.appendChild(title); day.doses.forEach(function(d,ti){ var row=document.createElement('div'); row.className='dose'; row.setAttribute('data-di',di); row.setAttribute('data-ti',ti); var left=document.createElement('div'); left.textContent=d.time; var right=document.createElement('button'); right.className='btn'; right.textContent='Mark Taken';
        right.addEventListener('click',function(){ stopAlarm(); day.doses.splice(ti,1); var hist=loadLS('smartmed.history'); hist.push({ date:day.date, time:d.time, markedAt:new Date().toISOString() }); saveLS('smartmed.history', hist); renderHistory(); if(currentMed){ if(currentMed.inventory){ if(currentMed.inventory.tablets>0){ var per=currentMed.inventory.perDose && currentMed.inventory.perDose.tablets || 1; currentMed.inventory.tablets=Math.max(0, currentMed.inventory.tablets-per); } else if(currentMed.inventory.ml>0){ var perml=currentMed.inventory.perDose && currentMed.inventory.perDose.ml || 5; currentMed.inventory.ml=Math.max(0, currentMed.inventory.ml-perml); } checkLowStock(currentMed); } persistCurrentMed(); } renderSchedule(schedule); });
        row.appendChild(left); row.appendChild(right); wrap.appendChild(row); }); scheduleList.appendChild(wrap); }); }
  function renderHistory(){ if(!historyList) return; var hist=loadLS('smartmed.history'); historyList.innerHTML=''; hist.slice(-20).reverse().forEach(function(h){ var li=document.createElement('div'); li.className='dose'; var l=document.createElement('div'); l.textContent=h.date+' '+h.time; var r=document.createElement('div'); r.textContent='✓'; r.className='taken'; li.appendChild(l); li.appendChild(r); historyList.appendChild(li); }); }
  function appendAlert(recipient, mobile, channel, medName, date, time){ if(!alertsLog) return; var item=document.createElement('div'); item.className='dose'; var left=document.createElement('div'); left.textContent='Sent to '+recipient+' ('+mobile+') via '+channel; var right=document.createElement('div'); right.textContent=medName+' '+date+' '+time; item.appendChild(left); item.appendChild(right); alertsLog.appendChild(item); var logs=loadLS('smartmed.alerts'); logs.push({ recipient:recipient, mobile:mobile, channel:channel, medName:medName, date:date, time:time, sentAt:new Date().toISOString() }); saveLS('smartmed.alerts', logs); }
  function sendAlerts(medObj, date, time){ var contacts=[]; var c=(medObj&&medObj.contact)||{}; if(c.fam1&&c.fam1.mobile) contacts.push({ name:c.fam1.name||'Family1', mobile:c.fam1.mobile }); if(c.fam2&&c.fam2.mobile) contacts.push({ name:c.fam2.name||'Family2', mobile:c.fam2.mobile }); if(c.caregiver&&c.caregiver.mobile) contacts.push({ name:c.caregiver.name||'Caregiver', mobile:c.caregiver.mobile }); var channels=[]; if(medObj&&medObj.reminders&&medObj.reminders.sms) channels.push('SMS'); if(medObj&&medObj.reminders&&medObj.reminders.wa) channels.push('WhatsApp'); if(channels.length===0) channels=['SMS','WhatsApp']; contacts.forEach(function(ct){ channels.forEach(function(ch){ appendAlert(ct.name, ct.mobile, ch, medObj.name||'Medicine', date, time); }); }); }
  function showStockBanner(text){ var host=document.querySelector('.schedule'); if(!host) return; var banner=document.createElement('div'); banner.className='stock-banner'; banner.textContent=text; host.insertBefore(banner, host.firstChild); setTimeout(function(){ try{ banner.remove(); }catch(e){} }, 2500); }
  function speak(text){ try{ if('speechSynthesis' in window){ window.speechSynthesis.cancel(); var u=new SpeechSynthesisUtterance(text); u.rate=1; u.pitch=1; window.speechSynthesis.speak(u); } }catch(e){} }
  function addRefillNeeded(medObj){ var list=loadLS('smartmed.refill_needed'); var exists=list.some(function(it){ return it.id===medObj.id; }); if(!exists){ list.push({ id:medObj.id, name:medObj.name||medObj.id, createdAt:new Date().toISOString() }); saveLS('smartmed.refill_needed', list); } renderEmergencyRefillList(); }
  function sendOneLeftAlerts(medObj){ var contacts=[]; var c=(medObj&&medObj.contact)||{}; if(c.fam1&&c.fam1.mobile) contacts.push({ name:c.fam1.name||'Family1', mobile:c.fam1.mobile }); if(c.fam2&&c.fam2.mobile) contacts.push({ name:c.fam2.name||'Family2', mobile:c.fam2.mobile }); if(c.caregiver&&c.caregiver.mobile) contacts.push({ name:c.caregiver.name||'Caregiver', mobile:c.caregiver.mobile }); var channels=['SMS','WhatsApp']; var date=todayISO(); var time=pad(new Date().getHours())+':'+pad(new Date().getMinutes()); showStockBanner('MESSAGE DELIVERED: '+(medObj.name||'Medicine')); contacts.forEach(function(ct){ channels.forEach(function(ch){ appendAlert(ct.name, ct.mobile, ch, 'One dose left '+(medObj.name||'Medicine'), date, time); }); }); }
  function showStockBanner(text){ var host=document.querySelector('.schedule'); if(!host) return; var banner=document.createElement('div'); banner.className='stock-banner'; banner.textContent=text; host.insertBefore(banner, host.firstChild); setTimeout(function(){ try{ banner.remove(); }catch(e){} }, 2500); }
  function sendStockAlerts(medObj, kind){ var contacts=[]; var c=(medObj&&medObj.contact)||{}; if(c.patient&&c.patient.mobile) contacts.push({ name:c.patient.name||'Patient', mobile:c.patient.mobile }); if(c.fam1&&c.fam1.mobile) contacts.push({ name:c.fam1.name||'Family1', mobile:c.fam1.mobile }); if(c.fam2&&c.fam2.mobile) contacts.push({ name:c.fam2.name||'Family2', mobile:c.fam2.mobile }); var channels=['SMS','WhatsApp']; var date=todayISO(); var time=pad(new Date().getHours())+':'+pad(new Date().getMinutes()); var label=(kind==='finished'?'Finished stock ':'Low stock ')+(medObj.name||'Medicine'); showStockBanner('MESSAGE DELIVERED: '+(medObj.name||'Medicine')); contacts.forEach(function(ct){ channels.forEach(function(ch){ appendAlert(ct.name, ct.mobile, ch, label, date, time); }); }); }
  function checkLowStock(medObj){ if(!medObj || !medObj.inventory) return; var inv=medObj.inventory; var finished=((inv.tablets||0)===0 && (inv.ml||0)===0); if(finished){ startAlarm('Finished stock '+(medObj.name||'')); sendStockAlerts(medObj,'finished'); speak(''+(medObj.name||'medicine')+' finished and needs refill'); addRefillNeeded(medObj); return; } var dosesLeft=Infinity; if(inv.tablets && inv.tablets>0){ var per=inv.perDose && inv.perDose.tablets || 1; dosesLeft=Math.floor(inv.tablets/per); } else if(inv.ml && inv.ml>0){ var perml=inv.perDose && inv.perDose.ml || 5; dosesLeft=Math.floor(inv.ml/perml); } if(dosesLeft===1){ startAlarm('Refill soon '+(medObj.name||'')); sendOneLeftAlerts(medObj); speak('Only one dose left for '+(medObj.name||'medicine')+'. Please refill.'); addRefillNeeded(medObj); selectRefillMed(medObj.id); } else if(dosesLeft<=2){ startAlarm('Low stock '+(medObj.name||'')); sendStockAlerts(medObj,'low'); }
  }
  function aggregateContacts(){ var out={ fam1:{}, fam2:{}, caregiver:{} }; var meds=loadLS('smartmed.meds'); meds.forEach(function(m){ if(m.contact){ if(m.contact.fam1&&m.contact.fam1.mobile){ out.fam1=m.contact.fam1; } if(m.contact.fam2&&m.contact.fam2.mobile){ out.fam2=m.contact.fam2; } if(m.contact.caregiver&&m.contact.caregiver.mobile){ out.caregiver=m.contact.caregiver; } } }); return out; }
  function sendEmergency(){ var contacts=[]; var fam1={ name:(emerFam1Name&&emerFam1Name.value)||'Family1', mobile:(emerFam1Mobile&&emerFam1Mobile.value)||'' }; var fam2={ name:(emerFam2Name&&emerFam2Name.value)||'Family2', mobile:(emerFam2Mobile&&emerFam2Mobile.value)||'' }; var care={ name:(emerCareName&&emerCareName.value)||'Caregiver', mobile:(emerCareMobile&&emerCareMobile.value)||'' }; [fam1,fam2,care].forEach(function(c){ if(c.mobile) contacts.push(c); }); if(contacts.length===0){ alert('Add at least one mobile'); return; } ['SMS','WhatsApp'].forEach(function(ch){ contacts.forEach(function(c){ appendAlert(c.name, c.mobile, ch, 'Emergency', todayISO(), pad(new Date().getHours())+':'+pad(new Date().getMinutes())); }); }); if(emerBanner){ emerBanner.style.display='block'; setTimeout(function(){ emerBanner.style.display='none'; }, 2500); } }
  function to24h(h,m,ampm){ h=parseInt(h,10); m=parseInt(m||'0',10); var ap=(ampm||'').toLowerCase(); if(ap==='pm'&&h<12) h+=12; if(ap==='am'&&h===12) h=0; return pad(h)+':'+pad(m); }
  function findTimes(line){ var times=[]; var L=line.toLowerCase(); if(/morning/.test(L)) times.push(defaultTimes.morning); if(/afternoon/.test(L)) times.push(defaultTimes.afternoon); if(/evening/.test(L)) times.push(defaultTimes.evening); if(/night/.test(L)) times.push(defaultTimes.night); if(/\bod\b|once daily/.test(L)) times.push(defaultTimes.morning); if(/\bbd\b|twice daily/.test(L)) { times.push(defaultTimes.morning); times.push(defaultTimes.night); } if(/\btid\b|thrice daily/.test(L)) { times.push(defaultTimes.morning); times.push(defaultTimes.afternoon); times.push(defaultTimes.night); }
    var dosePat=L.match(/\b([01])\-([01])\-([01])\b/); if(dosePat){ var map=['morning','afternoon','night']; for(var i=1;i<=3;i++){ if(dosePat[i]==='1'){ times.push(defaultTimes[map[i-1]]); } } }
    var re1=/\b(\d{1,2})[:\.]?(\d{2})\s*(am|pm)?\b/ig; var re2=/\b(\d{1,2})\s*(am|pm)\b/ig; var m;
    while((m=re1.exec(line))){ times.push(to24h(m[1],m[2],m[3])); }
    while((m=re2.exec(line))){ times.push(to24h(m[1],'0',m[2])); }
    var uniq={}; return times.filter(function(t){ var k=t; if(uniq[k]) return false; uniq[k]=true; return true; });
  }
  function extractName(line){ var clean=line.replace(/[|:,;]+/g,' ').trim(); var m=clean.match(/^[A-Za-z][A-Za-z\-]*(?:\s+[A-Za-z][A-Za-z\-]*){0,2}/); return m?m[0]:''; }
  function parsePrescriptionText(text){ var items=[]; var lines=text.split(/\r?\n/); lines.forEach(function(line){ var times=findTimes(line); var name=extractName(line); if(name&&times.length){ items.push({ name:name, times:times }); } }); return items; }
  if(rxScan){ rxScan.addEventListener('click',function(){ if(!window.Tesseract){ alert('Scanner unavailable'); return; } var f=rxFile&&rxFile.files&&rxFile.files[0]; if(!f){ alert('Select an image'); return; } if(rxStatus){ rxStatus.textContent='Scanning...'; }
      window.Tesseract.recognize(f,'eng',{ logger:function(l){ if(rxStatus){ rxStatus.textContent=l.status+' '+Math.round((l.progress||0)*100)+'%'; } } }).then(function(res){ var text=(res&&res.data&&res.data.text)||''; var items=parsePrescriptionText(text); if(rxResults){ rxResults.innerHTML=''; items.forEach(function(it){ var card=document.createElement('div'); card.className='schedule-day'; var title=document.createElement('div'); title.className='pill'; title.textContent=it.name; card.appendChild(title); it.times.forEach(function(t){ var row=document.createElement('div'); row.className='dose'; var l=document.createElement('div'); l.textContent=t; var r=document.createElement('div'); r.textContent='⏰'; row.appendChild(l); row.appendChild(r); card.appendChild(row); }); rxResults.appendChild(card); }); }
        var meds=loadLS('smartmed.meds'); items.forEach(function(it,idx){ var id='med-'+Date.now()+idx; var start=todayISO(); var schedule=generateSchedule(start, it.times); var medObj={ id:id, name:it.name, dosage:'', times:it.times, reminders:{ app:true, sms:false, wa:false }, start:start, createdAt:new Date().toISOString(), schedule:schedule, contact:{ fam1:{}, fam2:{}, caregiver:{} }, source:'scan' }; meds.push(medObj); if(idx===0){ currentMed=medObj; renderSchedule(schedule); } scheduleAlarms(schedule, medObj); }); saveLS('smartmed.meds', meds); if(rxStatus){ rxStatus.textContent='Scheduled '+items.length+' medicines.'; }
      }).catch(function(){ if(rxStatus){ rxStatus.textContent='Scan failed'; } }); }); }
  if(addTime){ addTime.addEventListener('click',function(){ addTimeInput(); }); }
  if(form){ addTimeInput(); if(startDate){ startDate.value=todayISO(); }
    form.addEventListener('submit',function(e){ e.preventDefault(); var name=(medName&&medName.value||'').trim(); var dose=(dosage&&dosage.value||'').trim(); var times=readTimes(); var rem={ app:reminderApp&&reminderApp.checked, sms:reminderSms&&reminderSms.checked, wa:reminderWa&&reminderWa.checked }; if(!name||times.length===0){ alert('Enter medicine name and at least one time'); return; }
      var fam1Name=document.getElementById('fam1-name')?.value||''; var fam1Mobile=document.getElementById('fam1-mobile')?.value||''; var fam2Name=document.getElementById('fam2-name')?.value||''; var fam2Mobile=document.getElementById('fam2-mobile')?.value||''; var careName=document.getElementById('care-name')?.value||''; var careMobile=document.getElementById('care-mobile')?.value||''; var pName=(patientNameInput&&patientNameInput.value)||''; var pMobile=(patientMobileInput&&patientMobileInput.value)||'';
      var contact={ patient:{ name:pName, mobile:pMobile }, fam1:{ name:fam1Name, mobile:fam1Mobile }, fam2:{ name:fam2Name, mobile:fam2Mobile }, caregiver:{ name:careName, mobile:careMobile } };
      var tabs=parseInt((stockTabletsInput&&stockTabletsInput.value)||'0',10)||0; var ml=parseInt((stockMlInput&&stockMlInput.value)||'0',10)||0; var inventory={ tablets:Math.max(0,tabs), ml:Math.max(0,ml), perDose:{ tablets:1, ml:5 } };
      var meds=loadLS('smartmed.meds'); var id='med-'+Date.now(); var start=(startDate&&startDate.value)||todayISO(); var schedule=generateSchedule(start, times); currentMed={ id:id, name:name, dosage:dose, times:times, reminders:rem, start:start, createdAt:new Date().toISOString(), schedule:schedule, contact:contact, inventory:inventory }; meds.push(currentMed); saveLS('smartmed.meds', meds); renderSchedule(schedule); scheduleAlarms(schedule, currentMed); });
    var existing=loadLS('smartmed.meds'); if(existing.length>0){ currentMed=existing[existing.length-1]; renderSchedule(currentMed.schedule); scheduleAlarms(currentMed.schedule, currentMed); }
    renderHistory();
  }
  if(scheduleToggle && scheduleList){ var btn=scheduleToggle.querySelector('.chevron-btn'); var open=false; var setState=function(o){ open=o; scheduleList.classList.toggle('hide', !open); btn.classList.toggle('open', open); btn.setAttribute('aria-expanded', String(open)); }; scheduleToggle.addEventListener('click',function(){ setState(!open); }); }
  if(historyToggle && historyList){ var hbtn=historyToggle.querySelector('.chevron-btn'); var hopen=false; var setH=function(o){ hopen=o; historyList.classList.toggle('hide', !hopen); hbtn.classList.toggle('open', hopen); hbtn.setAttribute('aria-expanded', String(hopen)); }; historyToggle.addEventListener('click',function(e){ if(e.target && e.target.id==='clear-history') return; setH(!hopen); }); }
  if(alertsToggle && alertsLog){ var abtn=alertsToggle.querySelector('.chevron-btn'); var aopen=false; var setA=function(o){ aopen=o; alertsLog.classList.toggle('hide', !aopen); abtn.classList.toggle('open', aopen); abtn.setAttribute('aria-expanded', String(aopen)); }; alertsToggle.addEventListener('click',function(e){ if(e.target && e.target.id==='clear-alerts') return; setA(!aopen); }); }
  if(scanToggle){ var sbtn=scanToggle.querySelector('.chevron-btn'); var sopen=false; var setS=function(o){ sopen=o; var res=document.getElementById('rx-results'); if(res){ res.classList.toggle('hide', !sopen); } sbtn.classList.toggle('open', sopen); sbtn.setAttribute('aria-expanded', String(sopen)); }; scanToggle.addEventListener('click',function(e){ if(e.target && e.target.id==='clear-scanned') return; setS(!sopen); }); }
  var clearScannedBtn=document.getElementById('clear-scanned');
  if(clearScannedBtn){ clearScannedBtn.addEventListener('click',function(e){ e.stopPropagation(); var res=document.getElementById('rx-results'); if(res){ res.innerHTML=''; } var meds=loadLS('smartmed.meds'); var remaining=[]; for(var i=0;i<meds.length;i++){ var m=meds[i]; var isScan=(m && (m.source==='scan' || !('inventory' in m))); if(!isScan) remaining.push(m); } var curDeleted=(currentMed && remaining.every(function(m){ return m.id!==currentMed.id; })); saveLS('smartmed.meds', remaining); if(curDeleted){ currentMed=null; renderSchedule([]); stopAlarm(); } if(alarmState.timeouts && alarmState.timeouts.length){ alarmState.timeouts.forEach(function(t){ try{ clearTimeout(t); }catch(e){} }); alarmState.timeouts=[]; } remaining.forEach(function(m){ if(m.schedule && m.schedule.length){ scheduleAlarms(m.schedule, m); } }); var status=document.getElementById('rx-status'); if(status){ status.textContent='Deleted scanned medicines.'; } populateRefillOptions(); }); }
  if(clearHistoryBtn){ clearHistoryBtn.addEventListener('click',function(e){ e.stopPropagation(); saveLS('smartmed.history', []); renderHistory(); }); }
  if(clearAlertsBtn){ clearAlertsBtn.addEventListener('click',function(e){ e.stopPropagation(); saveLS('smartmed.alerts', []); if(alertsLog){ alertsLog.innerHTML=''; } }); }
  if(emerBtn){ var agg=aggregateContacts(); if(emerFam1Name&&agg.fam1.name) emerFam1Name.value=agg.fam1.name; if(emerFam1Mobile&&agg.fam1.mobile) emerFam1Mobile.value=agg.fam1.mobile; if(emerFam2Name&&agg.fam2.name) emerFam2Name.value=agg.fam2.name; if(emerFam2Mobile&&agg.fam2.mobile) emerFam2Mobile.value=agg.fam2.mobile; if(emerCareName&&agg.caregiver.name) emerCareName.value=agg.caregiver.name; if(emerCareMobile&&agg.caregiver.mobile) emerCareMobile.value=agg.caregiver.mobile; emerBtn.addEventListener('click', sendEmergency); }
  var clearScheduledBtn=document.getElementById('clear-scheduled');
  if(clearScheduledBtn){ clearScheduledBtn.addEventListener('click', function(e){ e.stopPropagation(); clearScheduledAlarms(); }); }
  function selectRefillMed(medId){ if(!refillMedSelect) return; populateRefillOptions(); refillMedSelect.value=medId; var formEl=document.getElementById('refill-form'); if(formEl){ try{ formEl.scrollIntoView({ behavior:'smooth' }); }catch(e){} } }
  function renderRefillHistory(){ if(!refillList) return; var items=loadLS('smartmed.refill'); refillList.innerHTML=''; items.slice().reverse().forEach(function(it){ var row=document.createElement('div'); row.className='dose'; var left=document.createElement('div'); left.textContent=it.medName+' +'+(it.tabletsAdded||0)+' tabs +'+(it.mlAdded||0)+' ml'; var right=document.createElement('div'); right.textContent=new Date(it.markedAt).toLocaleString(); row.appendChild(left); row.appendChild(right); refillList.appendChild(row); }); }
  function populateRefillOptions(){ if(!refillMedSelect) return; var meds=loadLS('smartmed.meds'); refillMedSelect.innerHTML=''; meds.forEach(function(m){ var opt=document.createElement('option'); opt.value=m.id; opt.textContent=m.name||m.id; refillMedSelect.appendChild(opt); }); }
  if(refillHistoryToggle && refillList){ var rbtn=refillHistoryToggle.querySelector('.chevron-btn'); var ropen=false; var setR=function(o){ ropen=o; refillList.classList.toggle('hide', !ropen); rbtn.classList.toggle('open', ropen); rbtn.setAttribute('aria-expanded', String(ropen)); }; refillHistoryToggle.addEventListener('click',function(e){ if(e.target && e.target.id==='clear-refill') return; setR(!ropen); }); }
  if(clearRefillBtn){ clearRefillBtn.addEventListener('click',function(e){ e.stopPropagation(); saveLS('smartmed.refill', []); renderRefillHistory(); }); }
  if(markRefillBtn){ markRefillBtn.addEventListener('click',function(){ var medId=refillMedSelect&&refillMedSelect.value; var tabs=parseInt((refillTabsInput&&refillTabsInput.value)||'0',10)||0; var ml=parseInt((refillMlInput&&refillMlInput.value)||'0',10)||0; var meds=loadLS('smartmed.meds'); var target=meds.find(function(m){ return m.id===medId; }); if(!target){ alert('Select medicine'); return; } target.inventory=target.inventory||{ tablets:0, ml:0, perDose:{ tablets:1, ml:5 } }; target.inventory.tablets=Math.max(0,(target.inventory.tablets||0)+tabs); target.inventory.ml=Math.max(0,(target.inventory.ml||0)+ml); saveLS('smartmed.meds', meds); var log=loadLS('smartmed.refill'); log.push({ medId:medId, medName:target.name||medId, tabletsAdded:tabs, mlAdded:ml, markedAt:new Date().toISOString() }); saveLS('smartmed.refill', log); renderRefillHistory(); showStockBanner('Refilled: '+(target.name||medId)); if(currentMed && currentMed.id===medId){ currentMed=target; } }); }
  function renderEmergencyRefillList(){ if(!emerRefillList) return; var items=loadLS('smartmed.refill_needed'); emerRefillList.innerHTML=''; items.slice().reverse().forEach(function(it){ var row=document.createElement('div'); row.className='dose'; var left=document.createElement('div'); left.textContent=it.name; var right=document.createElement('div'); right.textContent=new Date(it.createdAt).toLocaleString(); row.appendChild(left); row.appendChild(right); emerRefillList.appendChild(row); }); }
  if(emerRefillToggle && emerRefillList){ var ebtn=emerRefillToggle.querySelector('.chevron-btn'); var eopen=false; var setE=function(o){ eopen=o; emerRefillList.classList.toggle('hide', !eopen); ebtn.classList.toggle('open', eopen); ebtn.setAttribute('aria-expanded', String(eopen)); }; emerRefillToggle.addEventListener('click',function(){ setE(!eopen); }); renderEmergencyRefillList(); }
  populateRefillOptions(); renderRefillHistory();
  var contact=document.getElementById('contact-form');
  var contactMsg=document.getElementById('contact-msg');
  if(contact){ contact.addEventListener('submit',function(e){ e.preventDefault(); var data=new FormData(contact); var obj={ name:data.get('name'), email:data.get('email'), message:data.get('message'), submittedAt:new Date().toISOString() }; var msgs=loadLS('smartmed.contact'); msgs.push(obj); saveLS('smartmed.contact', msgs); if(contactMsg){ contactMsg.textContent='Thank you, we will reach out shortly.'; } contact.reset(); }); }
});
