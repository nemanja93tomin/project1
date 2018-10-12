/**
 * User: Nemanja Tomin
 * Mail:  nemanja93tomin@gmail.com
 * Date: 10/9/2018
 * Time: 11:55 AM
 */
"use strict";
(function() {
    var mobileMenuTrigger = $('.navigation-trigger a:last-child');
    var personObject = $('.person-object');
    var fullName = $('.person-object h4');
    var info = $('.person-info');
    var age = $('.age p');
    var gender = $('.gender p');
    var friends = $('.friends p');
    var friendsOfFriendsInfo = $('.friends-of-friends p');
    var suggestedOfFriendsInfo = $('.suggested-friends p');
    var group = $('.group-wrapper');

    /**
     * events
     */

    var headerContainer = $('.head-content-wrapper');
    var footerContainer = $('.footer-content-wrapper');

    $.ajax({
        url     : 'js/data/data.json',
        method  : 'GET',
        dataType: 'json',
        success : function(data) {
            ParseJson(data);
        },
        error   : function() {
            console.log('ERROR', data);
        }

    });

    // when click on person, show person info
    personObject.click(function() {
        $(this).find(info).toggleClass('opened');
    });

    headerContainer.load('header.html', function() {
        var mobileMenuTrigger = $('.navigation-trigger a:last-child');
        if(utilities.IsExisty(mobileMenuTrigger)){
            mobileMenuTrigger.click(function(ev) {
                var linksContainer = $('.mobile-links-list-container');
                var currentState = linksContainer.css('display');
                linksContainer.slideToggle();
                var icon = $(this).find('i');
                switch(currentState) {
                    case 'none':
                        icon.removeClass();
                        icon.addClass('fa fa-times');
                        return false;
                        break;
                    case 'block':
                        icon.removeClass();
                        icon.addClass('fa fa-bars');
                        break;
                }

            });
        }
    });
    footerContainer.load('footer.html');

    function ParseJson(data) {

        data.map(function(d) {
            // filter friend's first and last name
            var fullFriends = data.filter(function(p) {
                return d.friends.includes(p.id);
            }).map(function(p) {
                return Object.assign({}, p);
            });
            var names = "";
            fullFriends.forEach(function(ff) {
                names += ff.firstName + " " + ff.surname + ", ";
            });
            d.myFriends = names.substring(0, names.length - 2);

            // filter friend's of my friend's
            var friendsOfFriends = [];
            fullFriends.forEach(function(f) {
                friendsOfFriends = friendsOfFriends.concat(f.friends.filter(function(ff) {
                    return ff !== d.id;
                }));
            });
            friendsOfFriends = friendsOfFriends.filter(function(e, pos, arr) {
                return arr.indexOf(e) == pos;
            });
            var names2 = "";
            friendsOfFriends = Object.assign({}, data.filter(function(p) {
                    return friendsOfFriends.includes(p.id);
                }).map(function(p) {
                    names2 += p.firstName + " " + p.surname + ", ";
                    return Object.assign({}, p);
                })
            );
            d.friendsOfMyFriends = names2.substring(0, names2.length - 2);
            ;

            // filter suggested friend's
            if(d.friends.length > 1){
                var suggestedNames = "";
                data.forEach(function(s) {
                    if(s.id !== d.id){
                        var x = s.friends.filter(function(sf) {
                            return sf !== d.id && d.friends.indexOf(sf) !== -1;
                        });
                        if(x.length > 1){
                            suggestedNames += s.firstName + " " + s.surname + ", ";
                        }
                    }
                });
                d.suggestedFriends = suggestedNames !== "" ? suggestedNames.substring(0, suggestedNames.length - 2) : d.suggestedFriends = "no suggested friends";
            }

            return d;
        });

        // show full name of person
        fullName.each(function(i) {
            var newFullName = data[i].firstName + ' ' + data[i].surname;
            $(this).html(newFullName);

            // show initials of the person in image container
            var name = $(this).html().split(' ');
            var finalInitials = (name[0][0] + name[1][0]);
            var imageContainer = $(this).closest('.person-object').find('.person-image');
            if(name[1][0] == null){
                imageContainer.html(name[0][0]);
            }
            else {
                imageContainer.html(finalInitials);
            }
        });

        // show age of person
        age.each(function(i) {
            var ageOfPerson = data[i].age;
            if(ageOfPerson != null){
                $(this).html('<span>Age: </span>' + ageOfPerson);
            }
            else {
                $(this).html('<span>Age: </span>/');
            }
        });

        // show gender of person
        gender.each(function(i) {
            var genderOfPerson = data[i].gender;
            $(this).html('<span>Gender: </span>' + genderOfPerson);
        });

        // show my friends
        friends.each(function(i) {
            $(this).html('<span>Friends: </span><br>' + data[i].myFriends);
        });

        // show friends of my friends
        friendsOfFriendsInfo.each(function(i) {
            $(this).html('<span>Friends of friends: </span>' + data[i].friendsOfMyFriends);
        });

        // show suggested friends
        suggestedOfFriendsInfo.each(function(i) {
            $(this).html('<span>Suggested friends: </span>' + data[i].suggestedFriends);
        });

    }

}());

