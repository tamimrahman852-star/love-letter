const pages=[...document.querySelectorAll('.page')],bar=document.getElementById('bar');
let page=0, beloved='Habiba';

function show(i){
  pages.forEach(p=>p.classList.remove('active'));
  pages[i].classList.add('active');
  page=i;
  bar.style.width=(i/(pages.length-1))*100+'%';

  if(i!==3 && i!==5){
    setClimax(false);
    setRoseFocus(false);
  }

  if(i===1){
    type(
      'type1',
      'কিছু ভালো লাগা হঠাৎ করে প্রবলভাবে আসে না, বরং তোমাকে বারবার মনে করতে করতে ধীরে ধীরে নিশ্চিত হয়ে ওঠে।'
    );
  }
}

document.querySelectorAll('.next').forEach(
  b=>b.onclick=()=>show(+b.dataset.next)
);

function toast(s){
  const t=document.getElementById('toast');
  t.textContent=s;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2200)
}

function type(id,txt){
  const el=document.getElementById(id);
  if(el.dataset.done)return;

  el.dataset.done=1;
  let n=0;

  let tm=setInterval(()=>{
    el.innerHTML=txt.slice(0,n)+'<span class="cursor"></span>';
    n++;

    if(n>txt.length){
      clearInterval(tm);
      el.innerHTML=txt
    }
  },70)
}


/* লোডার */

let lp=0,
    fill=document.getElementById('fill'),
    lt=document.getElementById('loaderText');

let texts=[
  'তারার আলো, ফুলের পাপড়ি আর হৃদস্পন্দন সংগ্রহ করা হচ্ছে...',
  'মনের কথাগুলো একটি চিঠিতে ভাঁজ করে রাখা হচ্ছে...',
  'গোলাপটিকে ধীরে ধীরে ফুটিয়ে তোলা হচ্ছে...',
  'এই ভালোবাসার চিঠি প্রস্তুত।'
];

let ltm=setInterval(()=>{
  lp+=Math.random()*16+8;

  if(lp>=100){
    lp=100;
    clearInterval(ltm);
    document.getElementById('start').style.display='inline-block'
  }

  lt.textContent=texts[Math.min(3,Math.floor(lp/28))];
  fill.style.width=lp+'%'
},420);

document.getElementById('start').onclick=()=>{
  startAudio();
  show(1)
};


/* ব্যাকগ্রাউন্ড তারার আলো */

const st=document.getElementById('stars'),
      sx=st.getContext('2d');

const pc=document.getElementById('particles'),
      px=pc.getContext('2d');

const fc=document.getElementById('fireworks'),
      fx=fc.getContext('2d');

const cc=document.getElementById('climax'),
      cx=cc.getContext('2d');

const rc=document.getElementById('roseFx'),
      rx=rc.getContext('2d');

let W,H,DPR,stars=[],parts=[],sparks=[];

function resize(){
  DPR=Math.min(devicePixelRatio||1,2);
  W=innerWidth;
  H=innerHeight;

  [st,pc,fc,cc,rc].forEach(c=>{
    c.width=W*DPR;
    c.height=H*DPR;
    c.style.width=W+'px';
    c.style.height=H+'px';
    c.getContext('2d').setTransform(DPR,0,0,DPR,0,0)
  });

  stars=Array.from(
    {length:Math.floor(W*H/5200)},
    ()=>({
      x:Math.random()*W,
      y:Math.random()*H,
      r:Math.random()*1.6+.3,
      a:Math.random()*.6+.25,
      vx:(Math.random()-.5)*.14,
      vy:(Math.random()-.5)*.14
    })
  );

  initParts();

  if(climaxOn)initNebula()
}

window.onresize=resize;

function drawStars(){
  sx.clearRect(0,0,W,H);

  stars.forEach((p,i)=>{
    p.x+=p.vx;
    p.y+=p.vy;

    if(p.x<0)p.x=W;
    if(p.x>W)p.x=0;
    if(p.y<0)p.y=H;
    if(p.y>H)p.y=0;

    sx.beginPath();
    sx.arc(p.x,p.y,p.r,0,Math.PI*2);
    sx.fillStyle=`rgba(255,255,255,${p.a})`;
    sx.fill();

    for(
      let j=i+1;
      j<Math.min(i+8,stars.length);
      j++
    ){
      let q=stars[j],
          d=Math.hypot(p.x-q.x,p.y-q.y);

      if(d<96){
        sx.strokeStyle=`rgba(255,255,255,${(1-d/96)*.09})`;
        sx.beginPath();
        sx.moveTo(p.x,p.y);
        sx.lineTo(q.x,q.y);
        sx.stroke()
      }
    }
  });

  requestAnimationFrame(drawStars)
}

window.addEventListener('pointermove',e=>{
  for(let i=0;i<2;i++)
    sparks.push({
      x:e.clientX+(Math.random()-.5)*12,
      y:e.clientY+(Math.random()-.5)*12,
      vx:(Math.random()-.5)*.8,
      vy:(Math.random()-.5)*.8,
      r:Math.random()*2+1,
      life:1,
      c:'255,126,182'
    })
});

window.addEventListener('pointerdown',e=>{
  burst(e.clientX,e.clientY,32)
});


/* কণার আকৃতি */

function heartPt(t,s){
  let x=16*Math.pow(Math.sin(t),3),
      y=-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t));

  return{
    x:W/2+x*s,
    y:H/2+y*s
  }
}

function textPts(text){
  let off=document.createElement('canvas'),
      c=off.getContext('2d');

  off.width=Math.min(980,W*.92);
  off.height=280;

  c.fillStyle='#fff';
  c.textAlign='center';
  c.textBaseline='middle';

  let fs=Math.min(
    118,
    Math.max(
      54,
      off.width/(Math.max(text.length,4)*.9)
    )
  );

  c.font=`900 ${fs}px -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif`;

  c.fillText(
    text,
    off.width/2,
    off.height/2
  );

  let data=c.getImageData(
    0,
    0,
    off.width,
    off.height
  ).data,
  pts=[],
  step=Math.max(
    4,
    Math.floor(off.width/150)
  );

  for(
    let y=0;
    y<off.height;
    y+=step
  )
    for(
      let x=0;
      x<off.width;
      x+=step
    )
      if(
        data[(y*off.width+x)*4+3]>80
      )
        pts.push({
          x:W/2-off.width/2+x,
          y:H/2-off.height/2+y
        });

  return pts.length
    ?pts
    :[{x:W/2,y:H/2}]
}


function galaxyPts(){
  let pts=[],
      base=Math.min(W,H),
      cx=W/2,
      cy=H/2;

  for(let arm=0;arm<4;arm++){
    let offset=arm*Math.PI/2;

    for(let i=0;i<210;i++){
      let t=i/32,
          r=i/210*base*.43;

      pts.push({
        x:cx+Math.cos(t+offset)*r*1.38+(Math.random()-.5)*18,
        y:cy+Math.sin(t+offset)*r*.66+(Math.random()-.5)*18
      })
    }
  }

  for(let i=0;i<160;i++){
    let a=Math.random()*Math.PI*2,
        r=Math.sqrt(Math.random())*base*.42;

    pts.push({
      x:cx+Math.cos(a)*r*1.22,
      y:cy+Math.sin(a)*r*.60
    })
  }

  return pts;
}


function rosePts(){
  let pts=[],
      base=Math.min(W,H),
      cx=W/2,
      cy=H/2-8,
      s=base/420;

  // বড়, মাঝখানে থাকা এবং স্পষ্ট গোলাপের মুকুট

  for(let layer=0;layer<8;layer++){
    let scale=(34+layer*19)*s;
    let k=3+layer%5;
    let n=190;

    for(let i=0;i<n;i++){
      let t=Math.PI*2*i/n;
      let r=scale*(0.70+0.30*Math.sin(k*t+layer*.58));

      pts.push({
        x:cx+Math.cos(t)*r*(1.08-layer*.018),
        y:cy+Math.sin(t)*r*.74
      })
    }
  }

  // আলোকিত কেন্দ্রের সর্পিল

  for(let i=0;i<300;i++){
    let t=i/18,
        r=i*.28*s;

    pts.push({
      x:cx+Math.cos(t)*r,
      y:cy+Math.sin(t)*r*.76
    })
  }

  // ফুলের কাছাকাছি পাপড়ির আলোর বলয়

  for(let i=0;i<260;i++){
    let a=Math.random()*Math.PI*2;
    let r=(Math.random()*.34+.66)*base*.34;

    pts.push({
      x:cx+Math.cos(a)*r,
      y:cy+Math.sin(a)*r*.66
    })
  }

  return pts
}


function initParts(){
  parts=Array.from(
    {length:620},
    ()=>({
      x:Math.random()*W,
      y:Math.random()*H,
      tx:Math.random()*W,
      ty:Math.random()*H,
      ox:Math.random()*W,
      oy:Math.random()*H,
      r:Math.random()*1.9+.85,
      c:Math.random()<.62
        ?'255,126,182'
        :(Math.random()<.5
          ?'255,217,142'
          :'183,232,255')
    })
  )
}

function setShape(shape){
  let pts=[];

  if(shape==='heart')
    pts=parts.map(()=>
      heartPt(
        Math.random()*Math.PI*2,
        Math.min(W,H)/38*(.75+Math.random()*.34)
      )
    );

  else if(shape==='name')
    pts=textPts(beloved);

  else if(shape==='love')
    pts=textPts('LOVE');

  else if(shape==='galaxy')
    pts=galaxyPts();

  else if(shape==='rose')
    pts=rosePts();

  else
    pts=parts.map(p=>({
      x:p.ox,
      y:p.oy
    }));

  parts.forEach((p,i)=>{
    let q=pts[i%pts.length];

    p.tx=q.x+(Math.random()-.5)*4;
    p.ty=q.y+(Math.random()-.5)*4
  })
}

function drawParts(){
  px.clearRect(0,0,W,H);

  if(page===3||page===5){
    parts.forEach(p=>{
      p.x+=(p.tx-p.x)*.060;
      p.y+=(p.ty-p.y)*.060;

      px.beginPath();
      px.arc(
        p.x,
        p.y,
        roseFocus?p.r*1.28:p.r,
        0,
        Math.PI*2
      );

      px.fillStyle=`rgba(${p.c},${roseFocus?.90:.76})`;
      px.shadowBlur=roseFocus?24:14;
      px.shadowColor=`rgba(${p.c},.75)`;
      px.fill();
      px.shadowBlur=0
    })
  }

  requestAnimationFrame(drawParts)
}


/* নাম পরিবর্তনের ব্যবস্থা সরিয়ে Habiba স্থায়ী করা হয়েছে */

const nameBtn=document.getElementById('nameBtn');

if(nameBtn){
  nameBtn.style.display='none';
}


document.getElementById('answer').onclick=()=>{
  const svg=document.getElementById('romanceSvg'),
        cap=document.getElementById('caption');

  setRoseFocus(false);
  setClimax(false);
  svg.classList.remove('svg-animate');

  const seq=[
    ['heart','তারার আলো ধীরে ধীরে একটি হৃদয়ে পরিণত হচ্ছে'],
    ['name','তারার আলোয় Habiba নামটি লেখা হচ্ছে'],
    ['love','ভালোবাসার শব্দটি ধীরে ধীরে তৈরি হচ্ছে'],
    ['scatter','ভালোবাসার শব্দটি ছড়িয়ে পড়ছে, আর রাতের আকাশে গ্যালাক্সি ছড়িয়ে যাচ্ছে'],
    ['svg','বিশাল চাঁদ উঠছে, গ্যালাক্সির ঘূর্ণি আর আলোয় ভরে উঠছে আকাশ'],
    ['rose','শেষে, চাঁদের আলোর সামনে গোলাপের মুকুট স্পষ্ট হয়ে ফুটে উঠছে']
  ];

  seq.forEach((it,i)=>
    setTimeout(()=>{
      if(it[0]==='svg'){
        setClimax(true);
        svg.classList.add('svg-animate');
        cap.textContent=it[1];

        burst(W/2,H*.42,170);

        setTimeout(
          ()=>burst(W*.22,H*.28,90),
          1000
        );

        setTimeout(
          ()=>burst(W*.78,H*.32,90),
          2100
        );

        setTimeout(
          ()=>burst(W*.50,H*.20,120),
          3200
        )
      }

      else{
        if(it[0]==='galaxy')
          setClimax(true);

        setShape(it[0]);
        cap.textContent=it[1];

        if(it[0]==='rose'){
          setRoseFocus(true);

          setTimeout(()=>{
            burst(W/2,H/2,230);
            fireworks();

            setTimeout(
              fireworks,
              1200
            )
          },1600)
        }
      }

      toast(it[1])
    },i*3900)
  )
};


/* সিনেমার মতো চূড়ান্ত নীহারিকা */

let climaxOn=false,
    nebulaDots=[];

function initNebula(){
  nebulaDots=Array.from(
    {length:320},
    ()=>({
      a:Math.random()*Math.PI*2,
      r:Math.random()*Math.min(W,H)*.43,
      z:Math.random()*1+.25,
      spin:(Math.random()-.5)*.003,
      hue:Math.random()<.45
        ?'255,126,182'
        :(Math.random()<.7
          ?'255,217,142'
          :'148,226,255'),
      size:Math.random()*2.15+.8
    })
  );
}

function setClimax(on){
  climaxOn=on;

  document.body.classList.toggle(
    'climax-on',
    on
  );

  cc.classList.toggle(
    'show',
    on
  );

  if(on && !nebulaDots.length)
    initNebula();
}

function drawClimax(){
  cx.clearRect(0,0,W,H);

  if(climaxOn){
    cx.save();
    cx.translate(W/2,H/2);

    const time=performance.now()*0.00035;

    for(const p of nebulaDots){
      p.a+=p.spin;

      const wave=Math.sin(
        time*3+p.r*.013
      )*18;

      const x=Math.cos(
        p.a+time
      )*(p.r+wave)*1.35;

      const y=Math.sin(
        p.a+time
      )*(p.r+wave)*.62;

      cx.beginPath();

      cx.arc(
        x,
        y,
        p.size*p.z,
        0,
        Math.PI*2
      );

      cx.fillStyle=`rgba(${p.hue},${0.18+0.42*p.z})`;
      cx.shadowBlur=22;
      cx.shadowColor=`rgba(${p.hue},.65)`;
      cx.fill();
    }

    // মাঝখানের আলোর আভা

    const g=cx.createRadialGradient(
      0,0,20,
      0,0,Math.min(W,H)*.45
    );

    g.addColorStop(
      0,
      'rgba(255,255,255,.20)'
    );

    g.addColorStop(
      .28,
      'rgba(255,126,182,.14)'
    );

    g.addColorStop(
      .62,
      'rgba(148,226,255,.08)'
    );

    g.addColorStop(
      1,
      'rgba(255,255,255,0)'
    );

    cx.fillStyle=g;
    cx.beginPath();

    cx.ellipse(
      0,
      0,
      Math.min(W,H)*.58,
      Math.min(W,H)*.34,
      0,
      0,
      Math.PI*2
    );

    cx.fill();
    cx.restore();
  }

  requestAnimationFrame(drawClimax);
}


/* গোলাপের সামনের আলোর আভা */

let roseFocus=false,
    roseDust=[];

function setRoseFocus(on){
  roseFocus=on;

  document.body.classList.toggle(
    'rose-focus',
    on
  );

  rc.classList.toggle(
    'show',
    on
  );

  if(on)
    initRoseDust();
}

function initRoseDust(){
  roseDust=Array.from(
    {length:190},
    ()=>({
      a:Math.random()*Math.PI*2,
      r:Math.random()*Math.min(W,H)*.32,
      z:Math.random()*1+.3,
      sp:(Math.random()-.5)*.006,
      size:Math.random()*2.15+.8,
      c:Math.random()<.58
        ?'255,126,182'
        :(Math.random()<.82
          ?'255,217,142'
          :'255,255,255')
    })
  );
}

function drawRoseFx(){
  rx.clearRect(0,0,W,H);

  if(roseFocus){
    const cx0=W/2,
          cy0=H/2-8;

    // গোলাপকে স্পষ্ট দেখানোর জন্য পেছনে অন্ধকার আভা

    let dg=rx.createRadialGradient(
      cx0,cy0,40,
      cx0,cy0,Math.min(W,H)*.48
    );

    dg.addColorStop(
      0,
      'rgba(0,0,0,.00)'
    );

    dg.addColorStop(
      .34,
      'rgba(0,0,0,.06)'
    );

    dg.addColorStop(
      .86,
      'rgba(0,0,0,.00)'
    );

    rx.fillStyle=dg;

    rx.fillRect(
      0,
      0,
      W,
      H
    );


    // গোলাপের ওপর আলোর কেন্দ্র

    let g=rx.createRadialGradient(
      cx0,cy0,10,
      cx0,cy0,Math.min(W,H)*.34
    );

    g.addColorStop(
      0,
      'rgba(255,255,255,.42)'
    );

    g.addColorStop(
      .20,
      'rgba(255,126,182,.28)'
    );

    g.addColorStop(
      .48,
      'rgba(255,217,142,.12)'
    );

    g.addColorStop(
      1,
      'rgba(255,126,182,0)'
    );

    rx.fillStyle=g;
    rx.beginPath();

    rx.ellipse(
      cx0,
      cy0,
      Math.min(W,H)*.40,
      Math.min(W,H)*.30,
      0,
      0,
      Math.PI*2
    );

    rx.fill();


    const t=performance.now()*0.0006;

    for(const p of roseDust){
      p.a+=p.sp;

      const wave=Math.sin(
        t*4+p.r*.02
      )*10;

      const x=
        cx0+
        Math.cos(p.a+t*.35)*
        (p.r+wave);

      const y=
        cy0+
        Math.sin(p.a+t*.35)*
        (p.r+wave)*.68;

      rx.beginPath();

      rx.arc(
        x,
        y,
        p.size*p.z,
        0,
        Math.PI*2
      );

      rx.fillStyle=`rgba(${p.c},${0.22+0.45*p.z})`;
      rx.shadowBlur=24;
      rx.shadowColor=`rgba(${p.c},.75)`;
      rx.fill();
      rx.shadowBlur=0;
    }
  }

  requestAnimationFrame(drawRoseFx);
}


/* আতশবাজি */

function burst(x,y,n){
  for(let i=0;i<n;i++){
    let a=Math.random()*Math.PI*2,
        sp=Math.random()*5+1.5;

    sparks.push({
      x,
      y,
      vx:Math.cos(a)*sp,
      vy:Math.sin(a)*sp,
      r:Math.random()*2.5+1,
      life:1,
      c:Math.random()<.55
        ?'255,126,182'
        :(Math.random()<.5
          ?'255,217,142'
          :'183,232,255')
    })
  }
}

function fireworks(){
  for(let k=0;k<5;k++)
    setTimeout(
      ()=>burst(
        Math.random()*W*.8+W*.1,
        Math.random()*H*.45+H*.12,
        86
      ),
      k*480
    )
}

function drawFx(){
  fx.clearRect(0,0,W,H);

  sparks.forEach((p,i)=>{
    p.life-=.018;
    p.x+=p.vx;
    p.y+=p.vy;
    p.vy+=.025;

    fx.beginPath();

    fx.arc(
      p.x,
      p.y,
      p.r,
      0,
      Math.PI*2
    );

    fx.fillStyle=`rgba(${p.c},${Math.max(0,p.life)})`;
    fx.fill();

    if(p.life<=0)
      sparks.splice(i,1)
  });

  requestAnimationFrame(drawFx)
}

document.getElementById('yes').onclick=()=>{
  show(5);
  setRoseFocus(true);
  setShape('rose');
  fireworks()
};

document.getElementById('wait').onclick=()=>{
  toast('কোনো সমস্যা নেই, আমি তোমাকে তাড়া দেব না। শুধু মন থেকে কথাটা বলতে চেয়েছিলাম।');
  burst(W/2,H*.68,70)
};

document.getElementById('again').onclick=fireworks;


/* ফুলের পাপড়ি */

function petal(){
  let p=document.createElement('div');

  p.className='petal';

  p.style.left=
    Math.random()*100+'vw';

  p.style.setProperty(
    '--dx',
    (Math.random()*180-90)+'px'
  );

  p.style.animationDuration=
    (8+Math.random()*8)+'s';

  p.style.opacity=
    .45+Math.random()*.45;

  document.body.appendChild(p);

  setTimeout(
    ()=>p.remove(),
    17000
  )
}

setInterval(
  petal,
  520
);


/* গান */

let on=false;

const mb=document.getElementById('music');
const bgm=document.getElementById('bgm');


function startAudio(){
  if(on)return;

  bgm.volume=.55;

  bgm.play().then(()=>{
    on=true;

    mb.classList.add('on');

    mb.querySelector('span').textContent=
      'গান চালু হয়েছে';

  }).catch(()=>{
    toast(
      'ব্রাউজার স্বয়ংক্রিয়ভাবে গান চালাতে দিচ্ছে না। আবার গান চালু করার বোতামে চাপুন।'
    );
  });
}


// পেজ খোলার পর সঙ্গে সঙ্গে গান চালানোর চেষ্টা করা হবে।
// ব্রাউজারের স্বয়ংক্রিয় চালানোর নিয়মে বাধা পড়লে,
// গান চালু করার বোতামটি হাতে চাপ দিয়ে চালু করা যাবে।

startAudio();


mb.onclick=()=>{
  if(!on){
    startAudio();
  }else{
    bgm.pause();
    on=false;

    mb.classList.remove('on');

    mb.querySelector('span').textContent=
      'গান চালু করুন';
  }
};


bgm.addEventListener(
  'ended',
  ()=>{
    bgm.currentTime=0;
    bgm.play();
  }
);


resize();
drawStars();
drawParts();
drawFx();
drawClimax();
drawRoseFx();