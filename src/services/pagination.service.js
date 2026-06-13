export const paginate = async ({
  Model,
  page = 1,
  limit = 10,
  filter = {},
  sort = "-createdAt",
  populate = [],
}) => {
  const skip = (page - 1) * limit;

  let query = Model.find(filter).sort(sort).skip(skip).limit(limit);

  populate.forEach((item) => {
    query = query.populate(item);
  });

  const [data, total] = await Promise.all([
    query,
    Model.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
