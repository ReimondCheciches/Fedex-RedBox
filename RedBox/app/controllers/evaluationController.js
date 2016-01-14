(function () {
    var myApp = angular.module('myApp');

    myApp.controller('evaluationController', ['$scope', '$http', 'evaluationItemFactory', 'authService', '_', 'toastr', '$location', '$route', '$rootScope', function ($scope, $http, evaluationItemFactory, authService, _, toastr, $location, $route, $rootScope) {

        $http.get('/api/Evaluation/GetEvaluationDueDate').success(function (response) {
            $scope.dueDate = response;
        });

        (function init() {
            $scope.coreValueSelected = false;
            $scope.coreValueSelectedToDo = false;
            $scope.selectedReviewers = [];
            $scope.newAchievement = {};
        })();

        var initializeItems = function (items) {
            _.each(items, function (item) {
                var evaluationItem = evaluationItemFactory.create();
                evaluationItem.init($scope.coreValues, item.coreValues, item.type);
                var description = item.description;
                angular.extend(item, evaluationItem);
                item.description = description;
            });
        }

        var setCoachAsReviewer = function (item) {
            if (item != null) {
                var defaultReviewer = _.find($scope.reviewers, function (rev) { return rev.username.toLowerCase() === item.username.toLowerCase() });
                if (_.find($scope.selectedReviewers, function (rev) { return rev.id == defaultReviewer.id }) == null) {
                    $scope.selectedReviewers.push(defaultReviewer);

                    defaultReviewer.evaluationId = $scope.evaluationId;
                    $http.post('/api/Evaluation/NewReviewer', defaultReviewer).success(function () {
                    });
                }
            }
        }

        var notifyState = function () {

            $scope.isReady = $scope.selectedAchievements.length > 0
                && $scope.selectedToDos.length > 0
                && ($scope.selectedReviewers.length >= 2 && $scope.selectedReviewers.length <= 5)
                && $scope.selectedCoach !== null;

            var checkAchivements = $.grep($scope.selectedAchievements, function (achievement) {
                return achievement.description.length === 0;
            });

            var checkTodos = $.grep($scope.selectedToDos, function (todo) {
                return todo.description.length === 0;
            });

            if (checkAchivements.length !== 0 || checkTodos.length !== 0)
                $scope.isReady = false;

        }

        var onEvaluationSuccess = function (response) {
            //redirect logic

            if (response.data.evaluation.statusId === 2) {
                $rootScope.hideSelfEvaluation = true;
                var redirectUrl = "/MyEvaluationDetail?evaluationId=" + response.data.evaluation.id;
                $location.url(redirectUrl);
                return;
            }

            $scope.coreValues = response.data.coreValues;
            $scope.evaluationId = response.data.evaluation.id;
            $scope.reviewers = response.data.reviewers;
            $scope.coaches = response.data.coaches;
            $scope.selectedCoach = response.data.evaluation.selectedCoach;
            $scope.apply = response.data.evaluation.apply;
            $scope.previousCoach = $scope.selectedCoach;
            $scope.reviewers = $scope.reviewers.filter(function (item) {
                return item.username.toLowerCase() != authService.authentification.userName.toLowerCase();
            });

            $scope.coaches = $scope.coaches.filter(function (item) {
                return item.username.toLowerCase() != authService.authentification.userName.toLowerCase();
            });

            $scope.selectedReviewers = _.map(response.data.evaluation.selectedReviewers, function (r) {
                return _.find($scope.reviewers, function (reviewer) {
                    return r.id === reviewer.id;
                });

            });

            setCoachAsReviewer($scope.selectedCoach);

            if (response.data.evaluation != null)
                $scope.evaluation = response.data.evaluation;

            $scope.evaluationItems = response.data.evaluation.items;
            $scope.evaluationItemCoreValues = response.data.evaluation.items.items; //Not sure what's this line about
            $scope.evaluationId = response.data.evaluation.id;
            $scope.evaluationDescription = response.data.evaluation.description;
            $scope.evaluationDate = response.data.evaluation.evaluationDate;

            var imageArray = ["/Content/CustomStyle/quality.png",
                              "/Content/CustomStyle/communication.png",
                              "/Content/CustomStyle/team.png",
                              "/Content/CustomStyle/learning.png",
                               "/Content/CustomStyle/family.png"];
            var i = 0;
            angular.forEach($scope.coreValues, function (coreValue) {
                coreValue.image = imageArray[i];
                i++;
            });


            //Geting achievements and toDos for all coreValues
            $scope.selectedAchievements = $.grep($scope.evaluationItems, function (achievement) {
                return achievement.type == 1;
            });
            $scope.selectedToDos = $.grep($scope.evaluationItems, function (toDo) {
                return toDo.type == 2;
            });

            initializeItems($scope.selectedAchievements);
            initializeItems($scope.selectedToDos);


            $scope.editedAchievement.init($scope.coreValues, null, 1);
            $scope.editedToDo.init($scope.coreValues, null, 2);

            $scope.isDropDownDisabled = $scope.selectedReviewers.length >= 5;
            notifyState();

        };
        var onEvaluationError = function (response) {
            $scope.error = "Couldn't fetch items";
        };

        var requestEvaluationId = $location.search()['evaluationId'];

        $http.get('/api/Evaluation/GetEvaluations?evaluationId=' + requestEvaluationId)
            .then(onEvaluationSuccess, onEvaluationError);

        $scope.selectedCoreValues = [];
        $scope.getSelectedCoreValue = function (data) {
            $scope.selectedEvaluationItems = [];
            if (!data.selected) {
                data.selected = true;
                $scope.selectedCoreValues.push(data);
            } else {
                data.selected = false;
                $scope.selectedCoreValues = _.without($scope.selectedCoreValues, data);
            }
            if ($scope.selectedCoreValues.length > 0) {
                _.each($scope.selectedCoreValues, function (coreValue) {
                    _.each($scope.evaluationItems, function (evaluationItem) {
                        _.each(evaluationItem.coreValues, function (itemCoreValueId) {
                            if (itemCoreValueId == coreValue.id && _.contains($scope.selectedEvaluationItems, evaluationItem))
                                $scope.selectedEvaluationItems.push(evaluationItem);
                        });
                    });
                });
            } else {
                $scope.selectedEvaluationItems = $scope.evaluationItems;
            }
            $scope.selectedAchievements = _.filter($scope.selectedEvaluationItems, function (achievement) {
                return achievement.type == 1;
            });

            $scope.selectedToDos = _.filter($scope.selectedEvaluationItems, function (toDo) {
                return toDo.type == 2;
            });

        };

        $scope.editSelectedItem = function (data) {
            if (data.type == 1) {

                $scope.isEdit = true;

                $scope.editedAchievement.description = data.description;
                $scope.editedAchievement.isEmpty = $scope.editedAchievement.description.length === 0;
                $scope.editedAchievement.init($scope.coreValues);

                angular.forEach(data.coreValues, function (v) {
                    for (var i = 0; i < $scope.editedAchievement.coreValues.length; i++) {
                        var value = $scope.editedAchievement.coreValues[i];

                        if (value.Id == v)
                            value.IsSelected = true;
                    }
                });
            } else {

                $scope.isEdit2 = true;

                $scope.editedToDo.Description = data.description;
                $scope.editedToDo.init($scope.coreValues);

                angular.forEach(data.coreValues, function (v) {
                    for (var i = 0; i < $scope.editedToDo.CoreValues.length; i++) {
                        var value = $scope.editedToDo.coreValues[i];

                        if (value.Id == v)
                            value.IsSelected = true;
                    }
                });
            }
        };

        $scope.removeItem = function (item) {
            if (confirm("Are you sure you want to remove this item?")) {
                $http.delete('/api/Evaluation/RemoveAchievement/' + item.id).success(function () {
                    if (item.type === 1)
                        $scope.selectedAchievements = _.without($scope.selectedAchievements, item);
                    else if (item.type === 2)
                        $scope.selectedToDos = _.without($scope.selectedToDos, item);
                    notifyState();
                })
                .error(function () {
                });
            }
        };

        $scope.saveItem = function (itemToSave, isUpdate, isReorder) {

            var item = {
                description: itemToSave.description,
                evaluationId: $scope.evaluationId,
                type: itemToSave.type,
                sortOrder: itemToSave.sortOrder,
                coreValues: []
            };
            if (item.type === 1 && item.sortOrder < 0) {
                item.sortOrder = _.filter($scope.selectedAchievements, function (achiev) {
                    return achiev.type === 1;
                }).length;
            } else if (item.type === 2 && item.sortOrder < 0) {
                item.sortOrder = _.filter($scope.selectedToDos, function (toDo) {
                    return toDo.type === 2;
                }).length;
            }

            if (isUpdate)
                item.id = itemToSave.id;

            // set core values
            _.each(itemToSave.coreValues, function (v) {
                if (v.isSelected) item.coreValues.push(v.id);
            });

            $http.post('/api/Evaluation/SaveAchievement', item).success(function (response) {
                if (isReorder)
                    return;
                if (isUpdate) {
                    if (item.type === 1) {
                        toastr.info('achievement updated!');
                        notifyState();
                    } else if (item.type === 2) {
                        toastr.info('todo updated!');
                        notifyState();
                    }
                    return;
                }
                if (item.type === 1) {

                    $scope.editedAchievement.id = response.id;
                    $scope.editedAchievement.isEmpty = $scope.editedAchievement.description.length === 0;
                    $scope.editedAchievement.sortOrder = $scope.selectedAchievements.length;
                    $scope.selectedAchievements.push($scope.editedAchievement);

                    $scope.editedAchievement = evaluationItemFactory.create();
                    $scope.editedAchievement.init($scope.coreValues, null, 1);
                    notifyState();
                    toastr.info('achievement added!');

                } else if (item.type === 2) {
                    $scope.editedToDo.id = response.id;
                    $scope.selectedToDos.push($scope.editedToDo);

                    $scope.editedToDo = evaluationItemFactory.create();
                    $scope.editedToDo.init($scope.coreValues, null, 2);
                    notifyState();
                    toastr.info('todo added!');
                }
            }).error(function () {

            });
        };

        $scope.setApplyPromotion = function () {
            $scope.apply = !$scope.apply;

            var postObject = {
                apply: $scope.apply,
                id: $scope.evaluationId
            };

            $http.post('/api/Evaluation/SetApply', postObject).success(function (data) {
                if (!data)
                    toastr.info('Apply for promotion: unchecked!');
                else
                    toastr.info('Apply for promotion: checked!');
            });
        };

        var removeCoachFromReviewers = function (item) {
            if (item !== null) {
                $scope.reviewerRemoved(item);
                $scope.selectedReviewers = $.grep($scope.selectedReviewers, function (rev) {
                    return rev.id !== item.id;
                });
            }
        }

        $scope.editedAchievement = evaluationItemFactory.create();
        $scope.editedToDo = evaluationItemFactory.create();

        $scope.reviewerAdded = function (item) {

            var request = {
                evaluationId: $scope.evaluationId
            };

            $scope.isDropDownDisabled = $scope.selectedReviewers.length >= 5;
            notifyState();

            angular.extend(item, request);

            $http.post('/api/Evaluation/NewReviewer', item).success(function () {
                toastr.info('reviewer added');
            });
        }

        $scope.reviewerRemoved = function (item) {

            $scope.removeErrorMessage = "";

            var request = {
                evaluationId: $scope.evaluationId
            };

            $scope.isDropDownDisabled = $scope.selectedReviewers.length >= 5;
            notifyState();

            angular.extend(item, request);

            $http.post('/api/Evaluation/RemoveReviewer', item).success(function () {
                toastr.info('reviewer removed');
            });
        }

        $scope.coachSelected = function (item) {

            var request = {
                evaluationId: $scope.evaluationId
            };

            notifyState();
            angular.extend(item, request);

            $http.post('/api/Evaluation/SelectCoach', item).success(function (response) {
                if (response !== null && item.id !== response.id)
                    removeCoachFromReviewers(response);
                setCoachAsReviewer($scope.selectedCoach);
            });
        }

        $scope.removeSelectedReviewers = function (data) {
            $scope.selectedReviewers = _.without($scope.selectedReviewers, data);
            $scope.reviewers.push(data);
            $scope.reviewers = _.sortBy($scope.reviewers, 'name');
        };

        $scope.dragStarted = false;

        $scope.setEditValue = function (item, value, id) {
            if (!$scope.dragStarted) {
                if (value === false && item.isEditable) {
                    $scope.saveItem(item, true);
                }
                if (value) $('#' + id).focus();
                item.isEditable = value;
            }
        }

        var resetOrderNumber = function (list) {
            var i = 0;
            _.each(list, function (listItem) {
                listItem.sortOrder = i;
                i++;
                $scope.saveItem(listItem, true, true);
            });
        }

        var reorderList = function (list, index, obj) {
            var otherObj = list[index];
            var otherIndex = list.indexOf(obj);
            list[index] = obj;
            list[otherIndex] = otherObj;
            $scope.dragStarted = false;
            resetOrderNumber(list);
        }

        $scope.onDropComplete = function (index, obj, evt, type) {
            if (type === 1 && obj.type === 1) {
                reorderList($scope.selectedAchievements, index, obj);
            } else if (type === 2 && obj.type === 2) {
                reorderList($scope.selectedToDos, index, obj);
            }
        }

        $scope.dragSuccess = function (evt) {
            $scope.dragStarted = true;
        }

        $scope.confirm = function () {

            var evaluationId = $scope.evaluation.id;
            $http.post('/api/Evaluation/Confirm', evaluationId)
                .success(function () {
                    toastr.info('Your evaluation has been confirmed');
                    $route.reload();
                })
                .error(function () {
                });
        };
    }]);

    myApp.factory("evaluationItemFactory", function () {
        return {
            create: function () {
                return {
                    description: '',
                    coreValues: [],

                    init: function (coreValues, existingSelectedCoreValuesIds, type) {
                        var values = [];

                        if (coreValues != null) {
                            angular.forEach(coreValues, function (v) {
                                var coreValue = { id: v.id, name: v.name };
                                if (existingSelectedCoreValuesIds) {
                                    coreValue.isSelected = !!_.find(existingSelectedCoreValuesIds, function (cv) {
                                        return cv === v.id;
                                    });
                                }
                                values.push(coreValue);
                            });
                        }

                        this.coreValues = values;

                        this.type = type;
                    }
                };
            }
        };
    });
}());