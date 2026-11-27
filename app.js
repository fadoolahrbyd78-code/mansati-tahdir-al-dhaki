const $ = (id) => document.getElementById(id);
const fields = ["teacher","grade","unit","lesson","week","periods","date","duration","cognitive","skills","affective","intro","explanation","activity","assessment","homework"];
const STORE = "mansati_lessons_v1";

function readForm(){
  const data = {};
  fields.forEach(id => data[id] = $(id).value.trim());
  data.savedAt = new Date().toISOString();
  return data;
}
function getSaved(){
  try { return JSON.parse(localStorage.getItem(STORE) || "[]"); }
  catch { return []; }
}
function persist(items){ localStorage.setItem(STORE, JSON.stringify(items)); renderSaved(); }
function esc(value=""){
  return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function section(title, value){
  return `<h3>${title}</h3><p>${esc(value || "لم يُضف بعد")}</p>`;
}
function buildPreview(d){
  return `<h2>تحضير درس في مادة الفيزياء</h2>
  <p><strong>المعلم/ة:</strong> ${esc(d.teacher)}　 <strong>الصف:</strong> ${esc(d.grade)}　 <strong>الوحدة:</strong> ${esc(d.unit)}</p>
  <p><strong>عنوان الدرس:</strong> ${esc(d.lesson)}　 <strong>الأسبوع:</strong> ${esc(d.week)}　 <strong>الحصص:</strong> ${esc(d.periods)}　 <strong>الزمن:</strong> ${esc(d.duration)} دقيقة</p>
  ${section("الأهداف المعرفية",d.cognitive)}${section("الأهداف المهارية",d.skills)}${section("الأهداف الوجدانية",d.affective)}
  ${section("التمهيد وإثارة الدافعية",d.intro)}${section("عرض المفاهيم وشرح الدرس",d.explanation)}${section("النشاط التعليمي والتطبيق",d.activity)}${section("التقويم",d.assessment)}${section("الخلاصة والواجب المنزلي",d.homework)}`;
}
function showPreview(d){
  $("previewContent").innerHTML = buildPreview(d);
  $("previewDialog").showModal();
}
function renderSaved(){
  const items = getSaved();
  $("savedCount").textContent = items.length;
  $("savedLabel").textContent = `${items.length} تحضير`;
  if(!items.length){
    $("savedList").innerHTML = `<div class="empty-state"><span>▤</span><strong>لا توجد تحضيرات محفوظة بعد</strong><p>عند حفظ أول تحضير سيظهر هنا.</p></div>`;
    return;
  }
  $("savedList").innerHTML = items.map((d,i)=>`<article class="saved-item">
    <div><strong>${esc(d.lesson || "درس دون عنوان")}</strong><small>${esc(d.grade)} · ${esc(d.unit)} · ${new Date(d.savedAt).toLocaleDateString("ar")}</small></div>
    <div class="button-row"><button data-preview="${i}">معاينة</button><button data-delete="${i}">حذف</button></div>
  </article>`).join("");
}
$("saveLesson").addEventListener("click",()=>{
  if(!$("lesson").value.trim()){ $("lesson").focus(); alert("يرجى كتابة عنوان الدرس أولاً."); return; }
  const items=getSaved(); items.unshift(readForm()); persist(items);
  alert("تم حفظ التحضير على هذا الجهاز.");
});
$("previewLesson").addEventListener("click",()=>{
  if(!$("lesson").value.trim()){ $("lesson").focus(); alert("يرجى كتابة عنوان الدرس أولاً."); return; }
  showPreview(readForm());
});
$("printTop").addEventListener("click",()=> $("previewLesson").click());
$("closePreview").addEventListener("click",()=> $("previewDialog").close());
$("printPreview").addEventListener("click",()=>window.print());
$("savedList").addEventListener("click",e=>{
  const p=e.target.dataset.preview, del=e.target.dataset.delete;
  if(p!==undefined) showPreview(getSaved()[Number(p)]);
  if(del!==undefined && confirm("هل تريدين حذف هذا التحضير؟")){
    const items=getSaved(); items.splice(Number(del),1); persist(items);
  }
});
$("lessonForm").addEventListener("reset",()=>setTimeout(()=>{},0));
renderSaved();
