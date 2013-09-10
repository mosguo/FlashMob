var AppData = function() {
	var _endpoints,
    	_initialCards,
        _activities,
    	_announcements,
        _private;

	_endpoints = {
		starbucksLocs: {path:"http://www.starbucks.com/api/location.ashx?&features=&lat={LAT}&long={LONG}&limit={MAX}", verb:"GET"},
		starbucksTest: {path:"scripts/testData/starbucksTest.json", verb:"GET"}
	};
    
	_initialCards = [
		{
			"cardNumber":"461253932",
			"amount":20,
			"bonusPoints":60,
			"expireDate":"2013/12/06"
		},{
			"cardNumber":"723128745",
			"amount":76,
			"bonusPoints":22,
			"expireDate":"2014/10/16"
		},{
			"cardNumber":"912472185",
			"amount":104,
			"bonusPoints":56,
			"expireDate":"2014/11/24"
		}
	];
    
    
    _activities = [
		{
			"name":"街舞(Hip-hop)",
			"description":"板橋火車站,A3出口,7/28 AM10:00~PM3:00,10人,age 10+.",
			"person":10,
			"age":10,
			"expireDate":"2013/12/06"
		},{
			"name":"夢想情人(Dream Lover)",
			"description":"西門町步道商圈6號出口，男生20人, 女生20人,age 18+.",
			"person":40,
			"age":18,
			"expireDate":"2013/9/06"
		}
	];
     
 	_announcements = [
		{ title: "街舞(Hip-hop)", description: "板橋火車站,A3出口,7/28 AM10:00~PM3:00,10人,age 10+.", url: "images/hip_hop.png" },
		{ title: "夢想情人(Dream Lover)", description: "西門町步道商圈6號出口，男生20人, 女生20人,age 18+.", url: "images/dream_lover.png" },
		{ title: "勝興電影節", description: "勝興戶外電影院.勝興車站,8/1 PM8:00~PM10:00,30人,年齡不限.", url: "images/shenghsing.png" },
		{ title: "集集水果市場", description: "集集車站,8/10 09:00~17:00,人數不限,年齡不限.", url: "images/jiji_station.jpg" },
		{ title: "公民之怒", description: "白衫軍8/3凱道送仲丘！首波宣傳片揭國防「怖」.8/3 AM9:00~AM12:00", url: "images/citizen.jpg" }
	];   
    
	_private = {
		load: function(route, options) {
			var path = route.path,
    			verb = route.verb,
    			dfd = new $.Deferred();

			console.log("GETTING", path, verb, options);

			//Return cached data if available (and fresh)
			if (verb === "GET" && _private.checkCache(path) === true) {
				//Return cached data
				dfd.resolve(_private.getCache(path));
			}
			else {
				//Get fresh data
				$.ajax({
					type: verb,
					url: path,
					data: options,
					dataType: "json"
				}).success(function (data, code, xhr) {
					_private.setCache(path, {
						data: data,
						expires: new Date(new Date().getTime() + (15 * 60000)) //+15min
					});
					dfd.resolve(data, code, xhr);
				}).error(function (e, r, m) {
					console.log("ERROR", e, r, m);
					dfd.reject(m);
				});
			}

			return dfd.promise();
		},
        
		checkCache: function(path) {
			var data,
			path = JSON.stringify(path);

			try {
				data = JSON.parse(localStorage.getItem(path));
                
				if (data === null || data.expires <= new Date().getTime()) {
					console.log("CACHE EMPTY", path);
					return false;
				}
			}
			catch (err) {
				console.log("CACHE CHECK ERROR", err);
				return false;
			}

			console.log("CACHE CHECK", true, path);
			return true;
		},
        
		setCache: function(path, data, expires) {
			var cache = {
				data: data,
				expires: expires
			},
			path = JSON.stringify(path);

			//TODO: Serialize JSON object to string
			localStorage.setItem(path, JSON.stringify(cache));

			console.log("CACHE SET", cache, new Date(expires), path);
		},
        
		getCache: function(path) {
			var path = JSON.stringify(path),
			cache = JSON.parse(localStorage.getItem(path));

			console.log("LOADING FROM CACHE", cache, path);

			//TODO: Deserialize JSON string
			return cache.data.data;
		}
	};

	return {
		getStarbucksLocations: function(lat, lng, max) {
			var route = $.extend({}, _endpoints.starbucksLocs);

			route.path = route.path.replace(/{LAT}/g, lat);
			route.path = route.path.replace(/{LONG}/g, lng);
			route.path = route.path.replace(/{MAX}/g, max || 10);

			if (document.location.hostname === "coffee") {
				//Test environment (localhost) - fake response
				route = $.extend({}, _endpoints.starbucksTest);
			}

			return _private.load(route, {});
		},
        
		getInitialCards: function() {
			return JSON.stringify(_initialCards);
		},
        
 		getActivities: function() {
			return JSON.stringify(_activities);
		},
        
		getAnnouncements: function() {
			return _announcements;
		}
	};
}