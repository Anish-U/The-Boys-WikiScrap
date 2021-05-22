// Importing the libraries
const cheerio = require("cheerio");
const fetch = require("node-fetch");

function scrapData(link) {
  return fetch(link)
    .then((response) => response.text())
    .then((html) => {
      const $ = cheerio.load(html);

      // Logo URL
      const logoURL = "https://" + $(".infobox .image img").attr("src");

      // Genres
      const genres = [];
      $(".infobox-data.category ul li a").each(function (i, ele) {
        $ele = $(ele);
        const genre = $ele.text().trim();
        genres.push(genre);
      });

      // Cast Details
      const mainCast = returnCast("Main", $);
      const recurringCast = returnCast("Recurring", $);
      const guestCast1 = returnCast("Introduced_in_season_1", $);
      const guestCast2 = returnCast("Introduced_in_season_2", $);

      // No of Seasons
      const $table = $("#Episodes").parent().next();
      const noOfSeasons = $table.find("tr").length - 2;

      const finalJSON = {
        logo: logoURL,
        genre: genres,
        seasons: noOfSeasons,
        cast: {
          main: mainCast,
          recurring: recurringCast,
          guest_s1: guestCast1,
          guest_s2: guestCast2,
        },
      };

      return finalJSON;
    });
}

// Function to fetch Cast details
function returnCast(id, $) {
  const cast = [];
  $ul = $(`#${id}`).parent().next();
  $ul.find("li").each(function (i, ele) {
    $ele = $(ele);
    const actorData = $ele.text().trim();
    const nameStr = actorData.split(" – ")[0];
    const desc = actorData.split(" – ")[1].replace(/\[.*\]/g, "");

    const name = nameStr.split(" as ")[0].trim();

    let role = nameStr.split(" as ")[1].trim();
    role = role.replace(/\[.*\]/g, "");

    const artist = {
      name: name,
      role: role,
      description: desc,
    };

    cast.push(artist);
  });
  return cast;
}

module.exports = {
  scrapData,
};
