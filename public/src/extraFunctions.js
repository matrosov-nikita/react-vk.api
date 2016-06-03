

var sendRequestVkAPI = (reqName, params, callback) => {
  VK.Api.call(reqName, params, function(r) { 
	  if (r.response)  callback(r.response);
	});	
}

var greet  = () => {
  sendRequestVkAPI('users.get',{}, (res)=> {
  	alert(res[0].first_name);
  });
}

var getCountPostsFromWall = (shortGroupName) => {
	return getPostsFromWall(shortGroupName, 1,0);
}

var getPostsFromWall = (shortGroupName, count, offset) => {
	return new Promise((resolve)=> {
		sendRequestVkAPI('wall.get',{domain: shortGroupName, count: count, offset: offset}, (res)=> {
		resolve(res);
	})
	})
}

var chooseTop10 = function(firstArray, secondArray) {
    var firstIndex  = 0,
        secondIndex = 0,
        result      = [];

    function existMovieString(topMovieArray, movie) {
        var movieHeader  = movie.text.split('<br>')[0];
        var resultContain = topMovieArray.some((movie)=>movie.text.split('<br')[0]==movieHeader);
        return resultContain;                
    }


    var countIteration = 20;
    for (var i = 0; i < countIteration; i++) {
        if (!secondArray[secondIndex] || firstArray[firstIndex].likes.count > secondArray[secondIndex].likes.count) {
            if (!existMovieString(result,firstArray[firstIndex])) result.push(firstArray[firstIndex]); 
            firstIndex++;
        } else {
            if (!existMovieString(result,secondArray[secondIndex])) result.push(secondArray[secondIndex]); 
            secondIndex++;
        }
    }
    return result;
	}



    var unnecessaryWords = ['лайк','лойз','самых','стен','подборка','фильм','паблик',
    'подписчик','ужас','like','посмотрим сколько нас','на фотографии','http'];
    var uppercaseUnnecessaryWords = unnecessaryWords.map((word)=>word.toUpperCase());

    function isNeedWord(movieString) {
        for (var indexUnneedWord = 0; indexUnneedWord <= unnecessaryWords.length; indexUnneedWord++) {
          var unneed = movieString.toLowerCase().indexOf(unnecessaryWords[indexUnneedWord])>-1 
            || movieString.toUpperCase().indexOf(uppercaseUnnecessaryWords[indexUnneedWord])>-1;
            if (unneed) return false;
        }
        return true;
    }



	function delay() {
		return new Promise((resolve) => {
			setTimeout(resolve, 400);
		});
	}

	function getPostsFromWallWithPause(groupName, count, offset) {
		return delay().then(function() {
			return getPostsFromWall(groupName, count, offset)
		});
	}

	function sortMoviesByLikes(arr) {

     arr = arr.sort(function(first, second) {
        return second.likes.count - first.likes.count;
     }).filter(function(element) {
        return element.text && isNeedWord(element.text.split('<br>')[0]);
     });
	}