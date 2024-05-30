class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const queryObj = { ...this.queryStr };

    // 1) Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // Parse the query string back to an object
    const parsedQuery = JSON.parse(queryStr);

    // 2) Adding custom filtering for name or email starting with a certain value
    if (parsedQuery.search) {
      const searchValue = parsedQuery.search;
      delete parsedQuery.search;

      // Add regex condition for name and email
      parsedQuery.$or = [
        { name: { $regex: `^${searchValue}`, $options: 'i' } },
        { email: { $regex: `^${searchValue}`, $options: 'i' } },
      ];
    }

    this.query = this.query.find(parsedQuery);

    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.replaceAll(',', ' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.replaceAll(',', ' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // Excluding __v if fields not specified
    }

    return this;
  }

  paginate() {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
