const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => { 
        if(req ?.roles) return res.sendStatus(401)
        const rolesArray = [...allowedRoles]
        console.log(rolesArray);
        console.log(req.roles);
        const result = req.roles.map(rolesArray.includes(role).find(val => val === true))
        if(!result) return result.sendStatus(401)
        next()
    }                                                                               
}

module.exports = verifyRoles