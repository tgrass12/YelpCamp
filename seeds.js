var mongoose     = require("mongoose"),
    Campground   = require("./models/campground"),
    Comment      = require("./models/comment");

var data = [
    {
        name: "Cloud's Rest",
        image: "https://farm6.staticflickr.com/5145/5649228252_7dbaf5434c.jpg",
        description: "Where clouds take breaks"
    },
    {
        name: "Mountain's Rest",
        image: "https://farm6.staticflickr.com/5616/15367422639_644310f605.jpg",
        description: "Where mountains take breaks"
    },
    {
        name: "Goat's Rest",
        image: "https://farm9.staticflickr.com/8572/16034357695_5ca6214f59.jpg",
        description: "Where goats take breaks"
    }
    
    ];
    
function seedDB() {
    
    Campground.remove({}, function(err) {
        if(err) {
            console.log(err);
        } else {
        console.log("Removed all campgrounds");
        
        data.forEach(function(seed) {
            Campground.create(seed, function(err, campground) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Added a campground");
                    
                    Comment.create(
                        {
                            text: "I LIKE TURTLES",
                            author: "me"
                        }, function(err, comment) {
                            if(err) {
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Added comment");
                            }
                        }
                    )
                }
            });
        });
        }
    });
}

module.exports = seedDB;