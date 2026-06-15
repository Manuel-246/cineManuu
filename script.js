// PASTE YOUR TMDB API KEY BELOW
const API_KEY = "ba6e19e5c1d62d89a5627608a8db8296";

const BASE_URL='https://api.themoviedb.org/3';
const IMAGE_URL='https://image.tmdb.org/t/p/w500';

const movies=document.getElementById('movies');
const search=document.getElementById('search');
const loader=document.getElementById('loader');
const modal=document.getElementById('modal');
const details=document.getElementById('details');

function showLoader(v){loader.style.display=v?'block':'none';}

async function fetchMovies(url){
 showLoader(true);
 try{
   const res=await fetch(url);
   const data=await res.json();
   renderMovies(data.results||[]);
 }catch(e){
   movies.innerHTML='<h2>Failed to load movies.</h2>';
 }
 showLoader(false);
}

function renderMovies(list){
 movies.innerHTML='';
 list.forEach(movie=>{
  const img=movie.poster_path?IMAGE_URL+movie.poster_path:'https://via.placeholder.com/500x750?text=No+Image';
  movies.innerHTML+=`
   <div class="card">
    <img src="${img}">
    <div class="info">
      <h3>${movie.title}</h3>
      <p>⭐ ${Number(movie.vote_average).toFixed(1)}</p>
      <button onclick="showMovieDetails(${movie.id})">Details</button>
    </div>
   </div>`;
 });
}

async function showMovieDetails(id){
 const res=await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
 const m=await res.json();
 modal.classList.remove('hidden');
 details.innerHTML=`
 <h2>${m.title}</h2>
 <p><b>Rating:</b> ${m.vote_average}</p>
 <p><b>Release:</b> ${m.release_date}</p>
 <p><b>Runtime:</b> ${m.runtime} min</p>
 <p>${m.overview}</p>`;
}
window.showMovieDetails=showMovieDetails;

let timer;
search.addEventListener('input',e=>{
 clearTimeout(timer);
 timer=setTimeout(()=>{
  const q=e.target.value.trim();
  if(q){
   fetchMovies(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(q)}`);
  }else{
   loadTrending();
  }
 },400);
});

document.getElementById('close').onclick=()=>modal.classList.add('hidden');
window.onclick=e=>{if(e.target===modal)modal.classList.add('hidden')}

function loadTrending(){
 fetchMovies(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
}
loadTrending();
