var ItemModel = require('../models/ItemModel.js');

/**
 * ItemController.js
 *
 * @description :: Server-side logic for managing Items.
 */
module.exports = {

    /**
     * ItemController.list()
     */
    list: function(req, res) {
        ItemModel.find().populate('tags').exec(function(err, Items){
            if(err) {
                return res.json(500, {
                    message: 'Error getting Item.'
                });
            }
            return res.json(Items);
        });
    },

    /**
     * ItemController.show()
     */
    show: function(req, res) {
        var id = req.params.id;
        ItemModel.findOne({_id: id}).populate('tags').exec(function(err, Item){
            if(err) {
                return res.json(500, {
                    message: 'Error getting Item.'
                });
            }
            if(!Item) {
                return res.json(404, {
                    message: 'No such Item'
                });
            }
            return res.json(Item);
        });
    },

    /**
     * ItemController.create()
     */
    create: function(req, res) {
        var Item = new ItemModel({			name : req.body.name,			tags : req.body.tags,
      list : req.body.list
        });

        Item.save(function(err, Item){
            if(err) {
                return res.json(500, {
                    message: 'Error saving Item',
                    error: err
                });
            }
            return res.json(Item);
        });
    },

    /**
     * ItemController.update()
     */
    update: function(req, res) {
        var id = req.params.id;
        ItemModel.findOne({_id: id}, function(err, Item){
            if(err) {
                return res.json(500, {
                    message: 'Error saving Item',
                    error: err
                });
            }
            if(!Item) {
                return res.json(404, {
                    message: 'No such Item'
                });
            }

            Item.name =  req.body.name ? req.body.name : Item.name;			      Item.tags =  req.body.tags ? req.body.tags : Item.tags;
            Item.list = req.body.list ? req.body.list : Item.list;
            Item.save(function(err, Item){
                if(err) {
                    return res.json(500, {
                        message: 'Error getting Item.'
                    });
                }
                if(!Item) {
                    return res.json(404, {
                        message: 'No such Item'
                    });
                }
                return res.json(Item);
            });
        });
    },

    /**
     * ItemController.remove()
     */
    remove: function(req, res) {
        var id = req.params.id;
        ItemModel.findByIdAndRemove(id, function(err, Item){
            if(err) {
                return res.json(500, {
                    message: 'Error getting Item.'
                });
            }
            return res.json(Item);
        });
    }
};
