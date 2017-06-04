var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground)  {
        if (err) {
            console.log (err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
               if(err) {
                   req.flash("error", "Something went wrong");
                   console.log(err);
               } else {
                   comment.author.username = req.user.username;
                   comment.author.id = req.user._id;
                   comment.save();
                   
                   campground.comments.push(comment);
                   campground.save();
                   
                   req.flash("success", "Successfully added a comment.");
                   res.redirect("/campgrounds/" + campground._id);
               }
            });
        }
    });
});

//EDIT COMMENT
router.get("/:comment_id/edit", middleware.checkCommentOwner, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            console.log(err)
        } else {
            res.render("comments/edit", {campground_id : req.params.id, comment: foundComment});
        }
    });
});

//UPDATE COMMENT
router.put("/:comment_id", middleware.checkCommentOwner, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY COMMENT
router.delete("/:comment_id", middleware.checkCommentOwner, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

module.exports = router;