import { Router } from "express";
import IRoute from "../types/IRoute";
import { User } from "../services/db";
const url = require("url");

const UsersRouter: IRoute = {
  route: "/users",
  router() {
    const router = Router();

    router
      .route("/")
      // Fetch all users
      .get(async (req, res) => {
        // pro tip: if you're not seeing any users, make sure you seeded the database.
        //          make sure you read the readme! :)

        console.log(req.url);

        const offset: number = Number(req.query.offset);
        const limit: number = Number(req.query.limit);

        await User.findAndCountAll({
          offset: offset,
          limit: limit,
        })
          .then(({ rows, count }) => {
            res.json({
              success: true,
              count: count,
              next:
                offset + limit < count
                  ? `http://127.0.0.1:50000/users?offset=${
                      offset + limit
                    }&limit=${limit}`
                  : null,
              previous:
                offset - limit >= 0
                  ? `http://127.0.0.1:50000/users?offset=${
                      offset - limit
                    }&limit=${limit}`
                  : null,
              results: rows,
            });
          })
          .catch((err) => {
            console.error("Failed to load users.", err);
            res.status(500).json({
              success: false,
            });
          });

        // return User.findAll()
        //   .then((users) => {
        //     return res.json({
        //       success: true,
        //       data: users,
        //     });
        //   })
        //   .catch((err) => {
        //     console.error("Failed to list all users.", err);
        //     res.status(500).json({
        //       success: false,
        //     });
        //   });
      });

    return router;
  },
};

export default UsersRouter;
