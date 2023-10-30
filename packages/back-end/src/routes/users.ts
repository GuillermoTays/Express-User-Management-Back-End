import { Router } from "express";
import IRoute from "../types/IRoute";
import { User } from "../services/db";
import { Op, where } from "sequelize";
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

        const offset: number = Number(req.query.offset);
        const limit: number = Number(req.query.limit);
        const filter: string = String(req.query.filter);
        const sort_key: string = String(req.query.sort_key);
        const sort_direction: string = String(req.query.sort_direction);

        console.log(sort_key, sort_direction);

        console.log(filter);

        await User.findAndCountAll({
          where: {
            [Op.or]: [
              {
                $firstName$: {
                  [Op.like]: `%${filter}%`,
                },
              },
              {
                $lastName$: {
                  [Op.like]: `%${filter}%`,
                },
              },
              {
                $email$: {
                  [Op.like]: `%${filter}%`,
                },
              },
            ],
          },
          order: [
            [`${sort_key}`, sort_direction === "descending" ? "DESC" : "ASC"],
          ],
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
                    }&limit=${limit}&filter=${filter}&sort_key=${sort_key}&sort_direction=${sort_direction}`
                  : null,
              previous:
                offset - limit >= 0
                  ? `http://127.0.0.1:50000/users?offset=${
                      offset - limit
                    }&limit=${limit}&filter=${filter}&sort_key=${sort_key}&sort_direction=${sort_direction}`
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
      });

    router.route("/add").post(async (req, res) => {
      let data = req.body;
      await User.findOrCreate({
        where: {
          $id$: data.id,
        },
        defaults: {
          ...data,
        },
      })
        .then(([user, created]) => {
          res.json({ user, created });
        })
        .catch((err) => {
          console.error("Failed to create a user", err);
          res.status(500).json({
            success: false,
          });
        });
    });

    router.route("/edit").post(async (req, res) => {
      let data = req.body;
      await User.update(
        {
          ...data,
        },
        {
          where: {
            $id$: data.id,
          },
        }
      )
        .then((affectedCount) => {
          res.json(`${affectedCount} has changed`);
        })
        .catch((err) => {
          console.error("Failed to update a user", err);
          res.status(500).json({
            success: false,
          });
        });
    });

    router.route("/delete").post(async (req, res) => {
      let data = req.body;
      await User.destroy({
        where: {
          $id$: data.id,
        },
      })
        .then((count) => {
          res.json(`${count} deleted`);
        })
        .catch((err) => {
          console.error("Failed to delete a user", err);
          res.status(500).json({
            success: false,
          });
        });
    });

    return router;
  },
};

export default UsersRouter;
