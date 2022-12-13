// Use the existing dishes data
const dishes = require("../data/dishes-data");

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

///////<------------------------middleWare------------------------>///////
function hasName(name) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[name]) {
      return next();
    }
    next({ status: 400, message: `Dish must include a name` });
  };
}

function hasDescription(description) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[description]) {
      return next();
    }
    next({ status: 400, message: `Dish must include a description` });
  };
}

function hasImageUrl(imageUrl) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[imageUrl]) {
      return next();
    }
    next({ status: 400, message: `Dish must include a image_url` });
  };
}

function hasPrice(price) {
  return function (req, res, next) {
    const { price } = req.body.data;
    if (typeof price !== "number")
      return next({
        status: 400,
        message: "price",
      });
    if (price && price > 0) {
      next();
    } else {
      next({ status: 400, message: `Dish must include a price` });
    }
  };
}

function dishIdExists(req, res, next) {
  const { dishId } = req.params;
  const dish = dishes.find((dish) => dish.id === dishId);
  if (dish) {
    res.locals.dish = dish;
    return next();
  }
  next({ status: 404, message: `Dish does not exist: ${dishId}` });
}
function dishIdsMatch(req, res, next) {
  const bodyId = req.body.data.id;
  const paramId = req.params.dishId;

  if (bodyId === null || !bodyId || bodyId === "") {
    req.body.data.id = paramId;
    return next();
  }

  if (bodyId != paramId)
    return next({
      status: 400,
      message: `Dish id does not match route id. Dish: ${bodyId}, Route: ${paramId}`,
    });
  return next();
}
///////<------------------------controller------------------------>///////
function list(req, res) {
  res.json({ data: dishes });
}
function create(req, res) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  let newDish = {
    id: 1,
    name,
    description,
    price,
    image_url,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}
function read(req, res, next) {
  const { dishId } = req.params;
  let foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish === undefined) {
    return next({ status: 404 });
  }
  res.status(200).json({ data: foundDish });
}
function update(req, res, next) {
  //   const { dishId } = req.params;
  //   const { data: { name, description, image_url, price } = {} } = req.body;
  // //   if(typeof price !== 'number'){
  // //     return next({status: 400})
  // //   }
  //   let foundDish = dishes.find((dish) => dish.id === dishId);
  //   if (foundDish === undefined) {
  //     return next({ status: 404, message: `Dish does not exist: ${dishId}` });
  //   }
  //   if (dishId) {
  //     if (foundDish.id !== dishId) {
  //       return next({
  //         status: 400,
  //         message: `Dish id does not match route id. Dish: ${foundDish.id}, Route: ${dishId}`,
  //       });
  //     }
  // }
  //   foundDish.name = name;
  //   foundDish.description = description;
  //   foundDish.image_url = image_url;
  //   foundDish.price = price;

  //   res.status(200).json({ data: foundDish });
  const oldDishData = res.locals.dish;
  const newDishData = req.body.data;
  res.status(200).json({ data: { ...oldDishData, ...newDishData } });
}
// function destory(req, res, next) {
//   const { dishId } = req.params;
//   const dish = dishes.find((dish) => dish.id === dishId);
//   if (dish) {
//     res.locals.dish = dish;
//     res.status(204)
//   }
//   res.status(404)
// }
module.exports = {
  list,
  create: [
    hasName("name"),
    hasDescription("description"),
    hasImageUrl("image_url"),
    hasPrice("price"),
    create,
  ],
  read,
  update: [
    dishIdExists,
    dishIdsMatch,
    hasName("name"),
    hasDescription("description"),
    hasImageUrl("image_url"),
    hasPrice("price"),
    update,
  ],
//   destory
};
