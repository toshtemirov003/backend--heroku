const { read, write } = require("../utils/models.js");

module.exports = {
  GET: (req, res) => {
    let { title, body } = req.query;
    const news = read("news");

    let filteredNews = news.filter((news) => {
      let byTitle = title ? news.title == title : true;
      let byBody = body ? news.body == body : true;

      return byTitle && byBody;
    });

    if (filteredNews.length) {
      return res.end(JSON.stringify(filteredNews));
    }

    res.end(JSON.stringify(news));
  },

  POST: (req, res) => {
    let str = "";
    req.on("data", (chunk) => (str += chunk));
    req.on("end", () => {
      let news = read("news");
      let { title, body, created_at } = JSON.parse(str);

      try {
        if (!(title.trim() && title.length > 3)) {
          throw new Error("Invalid Title");
        }
        if (!(body.trim() && body.length > 8)) {
          throw new Error("invalid Body");
        }
        let newNews = {
          newsId: news.at(-1)?.newsId + 1 || 1,
          title,
          body,
          created_at: new Date(),
        };
        news.push(newNews);
        write("news", news);
        res.writeHead(201, { "Content-Type": "application/json" });

        res.end(
          JSON.stringify({
            status: 201,
            message: "you are added news",
            data: newNews,
          })
        );
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: 400, message: error.message }));
      }
    });
  },

  DELETE: async (req, res) => {
    let { newsId } = await req.body;
    let news = read("news");

    try {
      let newsIndex = news.findIndex((item) => item.newsId == newsId);
      if (newsIndex == -1) {
        throw new Error("news not found");
      }
      news.splice(newsIndex, 1);
      write("news", news);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: 404,
          message: "news not found",
          data: news,
        })
      );
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: 400, message: error.message }));
    }
  },
  PUT: async (req, res) => {
    let { title, newsId } = await req.body;
    let news = read("news");

    try {
      let result = news.find((item) => item.newsId == newsId);
      if (!result) {
        throw new Error("Amalga oshirilmadi");
      }
      result.title = title;
      write("news", news);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: 404,
          message: "news O'zgarmadi",
          data: news,
        })
      );
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: 400, message: error.message }));
    }
  },
};
