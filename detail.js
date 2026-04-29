
function getImageSrc(img) {
  if (!img) return "";
  if (img.startsWith("http") || img.startsWith("assets/")) return img;
  return "assets/" + img;
}

function recommendationIndex(rating, reviews, average) {
  const ratingScore = rating * 15;
  const reviewScore = Math.min(reviews / 2, 25);
  const priceScore = average <= 1000 ? 18 : average <= 1500 ? 14 : average <= 1900 ? 10 : 6;
  return Math.min(Math.round(ratingScore + reviewScore + priceScore), 100);
}

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const r = restaurants.find(item => item.id === id) || restaurants[0];
document.title = r.name + " — ChinaFood SPB";

const index = recommendationIndex(r.rating, r.reviews, r.avg);
document.getElementById("detailContainer").innerHTML = `
  <img src="${getImageSrc(r.img)}" alt="${r.name}">
  <div class="detail-info">
    <span class="badge">${r.cat}</span>
    <h1>${r.name}</h1>
    <p>${r.desc}</p>
    <div class="recommend">
      <strong>Индекс рекомендации: ${index}/100</strong>
      <div class="recommend-bar"><div class="recommend-fill" style="width:${index}%"></div></div>
    </div>
    <div class="detail-grid">
      <div class="info-box"><b>Адрес</b>${r.addr}</div>
      <div class="info-box"><b>Район</b>${r.district}</div>
      <div class="info-box"><b>Метро</b>${r.metro}</div>
      <div class="info-box"><b>Средний чек</b>${r.avg} ₽</div>
      <div class="info-box"><b>Рейтинг</b>${r.rating} / 5</div>
      <div class="info-box"><b>Отзывы</b>${r.reviews}</div>
      <div class="info-box"><b>Часы работы</b>${r.hours}</div>
      <div class="info-box"><b>Телефон</b>${r.phone}</div>
    </div>
    <h3>Краткое описание</h3>
    <p>${r.name} — ${r.style}. Этот ресторан можно выбрать, если вам важны: ${r.features.join(", ")}.</p>
    <h3>Особенности</h3>
    <div class="feature-list">${r.features.map(f=>`<span>${f}</span>`).join("")}</div>
    <div class="detail-actions">
      <a href="https://yandex.ru/maps/?text=${encodeURIComponent(r.addr)}" target="_blank">Открыть адрес на карте</a>
      <a class="secondary" href="index.html#reviews">Оставить отзыв</a>
    </div>
  </div>
`;
