




const { getItemByName } = require("../postgres/itemQueries");

// item id if found
// false if not found
const checkItemExistsByName = async (itemName) => {
    try {
      const foundItem = await getItemByName(itemName);
  
      if (foundItem.length > 0) {
        return foundItem[0].id;
      }
  
      return false;
    } catch (error) {
      throw new Error(error.message)
    }
  };
  

  module.exports = { checkItemExistsByName}