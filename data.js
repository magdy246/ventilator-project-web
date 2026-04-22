const patientsDefault = [
  {id:1, name:'الحج محمد', scen:'normal'},
  {id:2, name:'الحج علي', scen:'pneumo'},
  {id:3, name:'الحج كريم', scen:'copd'},
  {id:4, name:'محاكاة حرة', scen:'normal'}
];
const scenariosDefault = [
  {id:'normal', name:'Normal', c:50, r:5, l:0, isCustom:false, init:{modeBase:'A/C', modeType:'VC', vt:500, rr:14, peep:5, pi:15, pHigh:35}},
  {id:'pneumo', name:'Pneumothorax', c:15, r:5, l:0, isCustom:false, init:{modeBase:'A/C', modeType:'PC', vt:350, rr:16, peep:5, pi:20, pHigh:45}},
  {id:'copd', name:'Obstruction', c:60, r:40, l:0, isCustom:false, init:{modeBase:'SIMV', modeType:'VC', vt:400, rr:12, peep:5, pi:15, pHigh:55}},
  {id:'leak', name:'Circuit Leak', c:50, r:5, l:300, isCustom:false, init:{modeBase:'A/C', modeType:'VC', vt:650, rr:14, peep:5, pi:15, pHigh:35}},
  {id:'apnea', name:'Apnea', c:50, r:5, l:0, isCustom:false, init:{modeBase:'A/C', modeType:'VC', vt:500, rr:0, peep:5, pi:15, pHigh:35}}
];
const baseExamConditions = [
  {type:"Cardiac Arrest", solType:'vent', solCtrl:'fio2', solVal:100, desc:"Total Apnea Detected (توقف تنفس)", solText:"رفع نسبة الأكسجين O2% إلى 100%", bestMode:"A/C - VC", hco3:14, sbar:{s:"توقف مفاجئ في المجهود التنفسي التلقائي مع انخفاض النبض.", b:"مريض قلب محجوز إثر جلطة حديثة.", a:"توقف عضلة القلب / توقف تنفس تام.", r:"ارفع الأكسجين لـ 100% فوراً وابدأ الإنعاش."}},
  {type:"Severe ARDS", solType:'vent', solCtrl:'vt', solVal:300, desc:"Stiff Lungs ARDS (تصلب الرئة)", solText:"استخدام الحجم المنخفض وتقليل VT إلى 300", bestMode:"A/C - PC", hco3:22, sbar:{s:"نقص حاد في الأكسجة مع ارتفاع شديد بضغط الفينت.", b:"مريض التهاب رئوي حاد وتسمم بالدم.", a:"تصلب شديد بالرئتين وانخفاض الـ Compliance.", r:"طبق استراتيجية حماية الرئة (Low VT) فوراً."}},
  {type:"Severe Bronchospasm", solType:'intervention', solCtrl:'bronchodilator', solVal:true, desc:"Asthma / High Airway Resistance (أزمة ربو)", solText:"إعطاء جلسة موسع شعب (Bronchodilator)", bestMode:"A/C - VC", hco3:25, sbar:{s:"صوت تزييق بالصدر مع ارتفاع ضغط الممرات الهوائية.", b:"مريض ربو مزمن تعرض لمحفز تحسسي.", a:"تشنج شعبي حاد (Bronchospasm).", r:"أعطِ المريض جلسة موسع شعب فوراً لفك التشنج."}},
  {type:"Circuit Disconnect", solType:'vent', solCtrl:'vt', solVal:700, desc:"Severe Circuit Leak (تسريب شديد)", solText:"زيادة الحجم VT مؤقتاً لتعويض التسريب", bestMode:"A/C - VC", hco3:24, sbar:{s:"إنذار مستمر لانخفاض شديد في الحجم والضغط.", b:"المريض تم تقليبه مؤخراً في السرير.", a:"احتمالية فصل أو ثقب في الوصلات.", r:"ارفع الحجم مؤقتاً لحين إصلاح التسريب."}},
  {type:"Patient Biting Tube", solType:'intervention', solCtrl:'sedation', solVal:true, desc:"Extreme Airway Obstruction (عض الأنبوبة)", solText:"إعطاء مهدئ (Sedation) للمريض", bestMode:"SIMV - PC", hco3:24, sbar:{s:"المريض مستيقظ ويقاوم الجهاز بشراسة، والضغط يصل للذروة.", b:"تم تقليل جرعة المهدئ لمحاولة الفطام.", a:"المريض يعض على الأنبوبة الحنجرية.", r:"أعطِ المريض جرعة مهدئ فوراً ليرتخي الفك."}},
  {type:"Mucus Plug", solType:'intervention', solCtrl:'suction', solVal:true, desc:"Secretions in Airway (انسداد بالبلغم)", solText:"عمل تشفيط (Suction) لتسليك المجرى", bestMode:"A/C - PC", hco3:24, sbar:{s:"انخفاض تدريجي في الأكسجين مع ارتفاع ملحوظ في الضغط.", b:"مريض مدخن يعاني من إفرازات كثيفة.", a:"انسداد جزئي بمجرى الهواء بسبب سدادة بلغم.", r:"قم بعمل تشفيط فوراً لتسليك المجرى الهوائي."}},
  {type:"Pulmonary Edema", solType:'vent', solCtrl:'peep', solVal:10, desc:"Fluid in Lungs (ارتشاح رئوي)", solText:"رفع الـ PEEP إلى 10 لفتح الحويصلات", bestMode:"A/C - VC", hco3:20, sbar:{s:"خروج إفرازات رغوية وردية مع نقص أكسجة.", b:"مريض فشل بعضلة القلب.", a:"ارتشاح رئوي حاد (Pulmonary Edema).", r:"ارفع ضغط الزفير (PEEP) لفتح الحويصلات ودفع السوائل."}},
  {type:"Tension Pneumothorax", solType:'vent', solCtrl:'vt', solVal:350, desc:"Sudden Drop in Compliance (استرواح هوائي)", solText:"تقليل الحجم VT إلى 350 لتقليل الضغط", bestMode:"A/C - PC", hco3:22, sbar:{s:"هبوط حاد في الضغط مع انتفاخ غير متساوٍ بالصدر.", b:"مريض حوادث يعاني من كسور بالضلوع.", a:"تجمع هواء ضاغط على الرئة (Pneumothorax).", r:"خفض حجم الهواء الفوري لتقليل الضغط لحين تركيب أنبوبة صدرية."}},
  {type:"Cuff Rupture", solType:'vent', solCtrl:'vt', solVal:650, desc:"ET Tube Cuff Leak (تسريب من البالون)", solText:"رفع حجم الهواء VT لتعويض الفاقد", bestMode:"A/C - VC", hco3:24, sbar:{s:"سماع صوت هواء يخرج من الفم مع كل نفس.", b:"أنبوبة حنجرية مركبة منذ 5 أيام.", a:"تسريب مستمر من البالون (Cuff Leak).", r:"عوض الحجم المفقود برفع الـ VT لحين نفخ البالون."}},
  {type:"COPD Exacerbation", solType:'vent', solCtrl:'rr', solVal:10, desc:"High PaCO2 / Air Trapping (انسداد مزمن)", solText:"تقليل معدل التنفس لزيادة خروج الـ CO2", bestMode:"SIMV - VC", hco3:32, sbar:{s:"احتباس شديد للهواء (Auto-PEEP) مع حموضة تنفسية بالتحليل.", b:"مريض سدة رئوية مزمنة (COPD).", a:"المريض لا يستطيع إخراج الهواء بالكامل (Air Trapping).", r:"قلل سرعة التنفس (RR) لتعطي فرصة أطول للزفير."}}
];
