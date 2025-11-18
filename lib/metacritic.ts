// export async function getLatestGames() {
//   const LATEST_GAMES = "https://fakestoreapi.com/products"; // API pública sin restricciones

import { UnsplashImage } from "@/app/[imageslug]";

//   const rawData = await fetch(LATEST_GAMES);
//   const items = await rawData.json();

//   return items.map((item) => {
//     return {
//       description: item.description,
//       slug: item.id.toString(),
//       releaseDate: "2024", // dato simulado
//       score: item.rating.rate,
//       title: item.title,
//       image: item.image,
//     };
//   });
// }
// Math.floor(Math.random() * 10) + 1,   
// Math.floor(Math.random() * 20) + 5

const ACCESS_KEY = "50JAGwcSkLOVkj59kwqqOePzA124x20ra6lr6ax4D0I";
export async function getLatestPrompts( page = Math.floor(Math.random() * 10) + 1, perPage = 3 ) {
  const LATEST_PROMPTS = `https://api.unsplash.com/photos?page=${page}&per_page=${perPage}&client_id=${ACCESS_KEY}`; // API pública sin restricciones

  const rawData = await fetch(LATEST_PROMPTS);
  const items: UnsplashImage[] = await rawData.json();

  // console.log("items");
  // console.log(items);
  

  return items.map((item) => {

    // console.log("item");
    // console.log(item);

    return {
      slug: item.id.toString(),
      image: item.urls.small,
    };
  });
}
