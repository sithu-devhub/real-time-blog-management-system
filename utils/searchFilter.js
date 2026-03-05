
// Helper funtion (Not a business logic)
module.exports = function getSearchFilter(searchTerm, userId = null) {
    const regex = new RegExp(searchTerm); // if we add (searchTerm, 'i'), then this becomes case-insensitive
    const filter = {
      $or: [
        { title: { $regex: regex } },
        { tags: { $in: [regex] } }
      ]
    };
  
    if (userId) {
      return { createdBy: userId, ...filter };
    }
  
    return filter;
  };
  