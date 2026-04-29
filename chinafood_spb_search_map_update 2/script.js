
function normalizeText(text) {
  return String(text || "").toLowerCase().replace(/ё/g, "е").trim();
}

function initRestaurantSuggestions() {
  const dl = document.getElementById("restaurantSuggestions");
  if (!dl) return;
  dl.innerHTML = restaurants.map(r => `<option value="${r.name}">${r.addr}</option>`).join("");
}

function goToRestaurantFromSearch() {
  const q = normalizeText(document.getElementById("searchInput").value);
  if (!q) {
    alert("Введите название ресторана.");
    return;
  }

  let found = restaurants.find(r => normalizeText(r.name) === q);

  if (!found) {
    found = restaurants.find(r =>
      normalizeText(r.name).includes(q) ||
      normalizeText(r.addr).includes(q) ||
      normalizeText(r.cat).includes(q)
    );
  }

  if (found) {
    window.location.href = `detail.html?id=${found.id}`;
  } else {
    alert("Ресторан не найден. Попробуйте выбрать название из подсказки.");
  }
}

const defaultReviews = [
  {user:"Ли Мин", restaurant:"Tianxi", rating:5, comment:"Удобный адрес на Васильевском острове, хорошее место для ужина."},
  {user:"Чжан", restaurant:"Тан Жэн", rating:5, comment:"Очень удобно на Невском проспекте, хороший вариант в центре."},
  {user:"Анна", restaurant:"Рамен Шифу / 拉面师傅", rating:5, comment:"Быстрый обед и вкусная лапша."},
  {user:"Ван", restaurant:"+86 Хого", rating:5, comment:"Хороший хого для компании."}
];

function recommendationIndex(rating, reviews, average) {
  const ratingScore = rating * 15;
  const reviewScore = Math.min(reviews / 2, 25);
  const priceScore = average <= 1000 ? 18 : average <= 1500 ? 14 : average <= 1900 ? 10 : 6;
  return Math.min(Math.round(ratingScore + reviewScore + priceScore), 100);
}

function renderRestaurants(list = restaurants) {
  const container = document.getElementById("restaurantList");
  container.innerHTML = "";
  list.forEach(r => {
    const index = recommendationIndex(r.rating, r.reviews, r.avg);
    const card = document.createElement("article");
    card.className = "restaurant-card";
    card.innerHTML = `
      <img src="assets/${r.img}" alt="${r.name}">
      <div class="restaurant-card-content">
        <span class="badge">${r.cat}</span>
        <h3><a href="detail.html?id=${r.id}">${r.name}</a></h3>
        <p>${r.desc}</p>
        <p><b>Район:</b> ${r.district}</p>
        <p>📍 ${r.addr}</p>
        <p>🚇 ${r.metro}</p>
        <p>💰 Средний чек: ${r.avg} ₽</p>
        <p>⭐ Рейтинг: ${r.rating} / 5 · ${r.reviews} отзывов</p>
        <div class="recommend">
          <strong>Индекс рекомендации: ${index}/100</strong>
          <div class="recommend-bar"><div class="recommend-fill" style="width:${index}%"></div></div>
        </div>
        <a class="detail-btn" href="detail.html?id=${r.id}">Открыть полную информацию</a>
      </div>`;
    container.appendChild(card);
  });
}

function filterRestaurants() {
  const q = document.getElementById("searchInput").value.toLowerCase();
  const cat = document.getElementById("categorySelect").value;
  const price = document.getElementById("priceSelect").value;
  const filtered = restaurants.filter(r => {
    const text = [r.name,r.cat,r.district,r.addr,r.metro,r.style,r.desc].join(" ").toLowerCase();
    const okText = text.includes(q);
    const okCat = cat === "all" || r.cat.includes(cat);
    const okPrice = price === "all" || (price === "low" && r.avg <= 1000) || (price === "mid" && r.avg > 1000 && r.avg <= 1700) || (price === "high" && r.avg > 1700);
    return okText && okCat && okPrice;
  });
  renderRestaurants(filtered);
}

function sortByIndex() {
  renderRestaurants([...restaurants].sort((a,b)=>recommendationIndex(b.rating,b.reviews,b.avg)-recommendationIndex(a.rating,a.reviews,a.avg)));
}
function sortByPrice() { renderRestaurants([...restaurants].sort((a,b)=>a.avg-b.avg)); }
function showAll() {
  document.getElementById("searchInput").value="";
  document.getElementById("categorySelect").value="all";
  document.getElementById("priceSelect").value="all";
  renderRestaurants(restaurants);
}
function renderMapList() {
  const list = document.getElementById("mapList");
  list.innerHTML = restaurants.map((r,i)=>`<div class="map-point"><a href="detail.html?id=${r.id}">${i+1}. ${r.name}</a><br>${r.addr}<br><small>${r.cat} · ${r.rating}/5 · ${r.avg} ₽</small></div>`).join("");
}
function initRestaurantSelect() {
  const s = document.getElementById("restaurantName");
  s.innerHTML = restaurants.map(r=>`<option>${r.name}</option>`).join("");
}
function renderReviews() {
  const saved = JSON.parse(localStorage.getItem("reviewsDetailVersion") || "null") || defaultReviews;
  const container = document.getElementById("reviewList");
  container.innerHTML = saved.map(item=>`
    <div class="review-item">
      <p><strong>${item.user}</strong> о ресторане <strong>${item.restaurant}</strong></p>
      <p>${"⭐".repeat(Number(item.rating))}</p>
      <p>${item.comment}</p>
    </div>`).join("");
}
function addReview() {
  const user = document.getElementById("userName").value.trim() || "Гость";
  const restaurant = document.getElementById("restaurantName").value;
  const rating = document.getElementById("rating").value;
  const comment = document.getElementById("comment").value.trim();
  if (!comment) { alert("Пожалуйста, напишите комментарий."); return; }
  const saved = JSON.parse(localStorage.getItem("reviewsDetailVersion") || "null") || defaultReviews;
  saved.unshift({user, restaurant, rating, comment});
  localStorage.setItem("reviewsDetailVersion", JSON.stringify(saved));
  document.getElementById("comment").value = "";
  document.getElementById("userName").value = "";
  renderReviews();
}
document.getElementById("searchInput").addEventListener("input", filterRestaurants);
document.getElementById("categorySelect").addEventListener("change", filterRestaurants);
document.getElementById("priceSelect").addEventListener("change", filterRestaurants);
renderRestaurants();
renderMapList();
initRestaurantSelect();
initRestaurantSuggestions();
renderReviews();

document.getElementById('searchInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') goToRestaurantFromSearch();
});
