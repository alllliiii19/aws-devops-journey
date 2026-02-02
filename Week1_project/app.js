const movies = [
  {title:"Viking Saga", img:"https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=400&q=80"},
  {title:"Cyber Rebellion", img:"https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80"},
  {title:"Neon City", img:"https://images.unsplash.com/photo-1520975922071-cf79a54f2fa3?auto=format&fit=crop&w=400&q=80"},
  {title:"Fantasy Quest", img:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80"}
];

const row = document.getElementById("movieRow");

movies.forEach(m=>{
  const div = document.createElement("div");
  div.className="movie";
  div.innerHTML = `<img src="${m.img}"><p>${m.title}</p>`;
  div.onclick=()=>openModal(m.title);
  row.appendChild(div);
});

function openModal(title){
  document.getElementById("modal").style.display="block";
  document.getElementById("modalTitle").innerText=title;
}

function closeModal(){
  document.getElementById("modal").style.display="none";
}

function startQuiz(){ alert("Quiz Started!"); }
function voteMovie(){ alert("Vote Submitted!"); }
function spinWheel(){ alert("You won Free Popcorn 🍿"); }

document.getElementById("searchBox").addEventListener("keyup",e=>{
  const val = e.target.value.toLowerCase();
  document.querySelectorAll(".movie").forEach(m=>{
    m.style.display = m.innerText.toLowerCase().includes(val) ? "block" : "none";
  });
});
