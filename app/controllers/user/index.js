const { User } = require('../../models');

module.exports ={
    register: async (req, res) => {
        const user = await User.create(req.body);
        res.json(user);
    },
    update: (req, res, params=null) => {
        let obj = {}
        obj .email = req.body.email? req.body.email :undefined
        obj .name = req.body.name? req.body.name :undefined
        obj .password = req.body.password? req.body.password :undefined
        User.update(obj,{ "where": { id: req.req.body.id } }
        ).then(function (rowsUpdated) {
            res.json(rowsUpdated)
        })
    },

    list_all: (req, res) => {
    User.findAll()
        .then(users => res.json(users))
    },
    search_by_id: (req, res) => {
        User.findOne({ where: { id: req.params.id } })
            .then(user => {
                res.json(user || { msg: 'Usuario nao existe' })
            })
    },
   delete_by_id: (req, res) => {
        User.destroy({ where: { id: req.params.id } })
            .then(user => { res.json(user) })
    },
    create: (req, res) => {
        User.findOrCreate(
            {
                where: { name: req.body.name },
                defaults: {
                    password: req.body.password,
                    email: req.body.email
                }
            })
            .then(([user, created]) => {
                console.log(user.get({
                    plain: true
                }));
                console.log(created);
                res.json(user)
            })

    }

}
