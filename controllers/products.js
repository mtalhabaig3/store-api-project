const Product = require("../models/product");

const getAllProductsStatic = (req, res) => {
  res.status(200).json({ msg: "products testing" });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }

  if (company) {
    queryObject.company = company;
  }

  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  if (numericFilters) {
    const operatorMap = {
      "<": "$lt",
      "<=": "$lte",
      "=": "$eq",
      ">": "$gt",
      ">=": "$gte",
    };
    const regEx = /\b(<|<=|=|>=|>)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }
  console.log(queryObject);

  let result = Product.find(queryObject);

  if (sort) {
    sortString = sort.split(",").join(" ");
    result = result.sort(sortString);
  } else {
    result = result.sort("createdAt");
  }

  if (fields) {
    fieldsString = fields.split(",").join(" ");
    result = result.select(fieldsString);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result.skip(skip).limit(limit);
  const products = await result;
  res.status(200).json({ products, nbhits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
