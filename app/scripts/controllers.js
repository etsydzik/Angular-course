'use strict';

angular.module('confusionApp')

    .controller('MenuController', ['$scope', 'menuFactory', function ($scope, menuFactory) {
        $scope.tab = 1;
        $scope.filtText = '';
        $scope.showDetails = false;

        $scope.message = "Loading ...";
        //$scope.showMenu = false;
        //$scope.dishes = {};
        //menuFactory.getDishes()
        //    .then(
        //    function (response) {
        //        $scope.dishes = response.data;
        //        $scope.showMenu = true;
        //    },
        //    function (response) {
        //        $scope.message = "Error: " + response.status + " " + response.statusText;
        //    }
        //);
        $scope.showMenu = false;
        menuFactory.getDishes().query(
            function (response) {
                $scope.dishes = response;
                $scope.showMenu = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            });

        $scope.select = function (setTab) {
            $scope.tab = setTab;
            if (setTab === 2) {
                $scope.filtText = "appetizer";
            }
            else if (setTab === 3) {
                $scope.filtText = "mains";
            }
            else if (setTab === 4) {
                $scope.filtText = "dessert";
            }
            else {
                $scope.filtText = "";
            }
        };
        $scope.isSelected = function (checkTab) {
            return ($scope.tab === checkTab);
        };

        $scope.toggleDetails = function () {
            $scope.showDetails = !$scope.showDetails;
        };
    }])
    .controller('ContactController', ['$scope', function ($scope) {

        $scope.feedback = {
            mychannel: "", firstName: "", lastName: "",
            agree: false, email: ""
        };

        var channels = [{value: "tel", label: "Tel."}, {value: "Email", label: "Email"}];
        $scope.channels = channels;

        $scope.invalidChannelSelection = false;
    }])

    .controller('FeedbackController', ['$scope', 'feedbackFactory', function ($scope, feedbackFactory) {
        $scope.sendFeedback = function () {
            if ($scope.feedback.agree && ($scope.feedback.mychannel == "") && !$scope.feedback.mychannel) {
                $scope.invalidChannelSelection = true;
                console.log('incorrect');
            }
            else {
                $scope.invalidChannelSelection = false;
                feedbackFactory.getFeedbacks().save($scope.feedback);
                $scope.feedback = {
                    mychannel: "", firstName: "", lastName: "",
                    agree: false, email: ""
                };
                $scope.feedbackForm.$setPristine();
            }
        };
    }])

    .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory',
        function ($scope, $stateParams, menuFactory) {

            $scope.dish = {};
            $scope.message = "Loading ...";
            //$scope.showDish = false;
            //menuFactory.getDish(parseInt($stateParams.id, 10))
            //    .then(
            //    function (response) {
            //        $scope.dish = response.data;
            //        $scope.showDish = true;
            //    },
            //    function (response) {
            //        $scope.message = "Error: " + response.status + " " + response.statusText;
            //    }
            //);

            $scope.showDish = false;
            $scope.dish = menuFactory.getDishes().get({id: parseInt($stateParams.id, 10)})
                .$promise.then(
                function (response) {
                    $scope.dish = response;
                    $scope.showDish = true;
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );
        }])

    .controller('DishCommentController', ['$scope', 'menuFactory', function ($scope, menuFactory) {
        $scope.newComment = {
            rating: "5",
            comment: "",
            author: "",
            date: ""
        };

        $scope.submitComment = function () {
            $scope.newComment.date = new Date().toISOString();
            $scope.dish.comments.push($scope.newComment);
            menuFactory.getDishes().update({id: $scope.dish.id}, $scope.dish);
            $scope.commentForm.$setPristine();
            $scope.newComment = {
                rating: "5",
                comment: "",
                author: "",
                date: ""
            };
        }
    }])

    .controller('IndexController', ['$scope', '$stateParams', 'menuFactory', 'corporateFactory',
        function ($scope, $stateParams, menuFactory, corporateFactory) {

            $scope.message = "Loading ...";

            //$scope.dish = {};
            //$scope.showDish = false;
            //
            //menuFactory.getDish(0)
            //    .then(
            //    function (response) {
            //        $scope.dish = response.data;
            //        $scope.showDish = true;
            //    },
            //    function (response) {
            //        $scope.message = "Error: " + response.status + " " + response.statusText;
            //    }
            //);
            $scope.showDish = false;
            $scope.dish = menuFactory.getDishes().get({id: 0})
                .$promise.then(
                function (response) {
                    $scope.dish = response;
                    $scope.showDish = true;
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );

            $scope.showPromotion = false;
            $scope.promotion = menuFactory.getPromotions().get({id: 0})
                .$promise.then(
                function (response) {
                    $scope.promotion = response;
                    $scope.showPromotion = true;
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );

            $scope.showLeader = false;
            $scope.leader = corporateFactory.getLeaders().get({id: 3})
                .$promise.then(
                function (response) {
                    $scope.leader = response;
                    $scope.showLeader = true;
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );
        }])


    .controller('AboutController', ['$scope', 'corporateFactory', function ($scope, corporateFactory) {
        $scope.showLeader = false;
        $scope.leaders = corporateFactory.getLeaders().query(
            function (response) {
                $scope.leaders = response;
                $scope.showLeader = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            });
    }])
;