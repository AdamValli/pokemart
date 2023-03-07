




// for passport init

const { getUserByUsername } = require("../postgres/userQueries")

// looks up db and authenticates user
const authUser = async (username, password, done) => {
try {
    // find user
    const found = await getUserByUsername(username);

    console.log(found);
    // authenticate user

    // success

    // failed
    
} catch (error) {
    done(error, false)
}

    // error
}