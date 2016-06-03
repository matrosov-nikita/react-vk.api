var MovieRow = React.createClass({
	render: function() {
		alert("start render");
		return (
			<tr>
				<td> {this.props.movie.name} </td>
				<td> {this.props.movie.description} </td>
			</tr>
			)
	}
});

var MovieTable = React.createClass({
	getInitialState: function() {
		return {movies: [] }
	},

	getWallPosts: function(groupName) {	  

	       		var count = 100;
				var self = this;
   				getCountPostsFromWall(groupName)

   				.then((countPosts) => {
					return countPosts[0];

   				})

   				.then((res)=> {
   					if (res < 100) {
   						return getPostsFromWall(groupName, count, 0);
   					}

   					var arr = Array.apply(null, Array(Math.ceil(res/count)));
   					

   					return arr.reduce(function(chain, element, index) {
   						return chain.then(function(result) {

   								sortMoviesByLikes(result);

   								  if (self.state.movies.length === 0) {		                     
			                        	self.setState({movies: result.slice(0,20)});
	                    			} else {
			                        self.setState({movies: chooseTop10(self.state.movies, result)});
		                    	  }

   							   return getPostsFromWallWithPause(groupName,count,index*count + count);
   						})
   					}, getPostsFromWall(groupName, count, 0));
   				})

   				.then((result)=> {
   					sortMoviesByLikes(result);
   				     self.setState({movies: result.slice(1)});
   				})
   				.catch(console.error.bind(window));	   
	    	 },

	componentDidMount: function() {
		this.getWallPosts('nightmares');
	},

	render: function() {
		var movieRows = this.state.movies.map((movie)=> {
			return (
				<MovieRow movie={movie} key={movie.id} />
			)
		})
		return (
			<table className="table table-striped">
				<thead>
					<th>Название</th>
					<th>Описание</th>
				</thead>
				<tbody>
					{movieRows}
				</tbody>
			</table>
		)
	}
})

ReactDOM.render(<MovieTable movieURL ='/config.json' />, document.getElementById('box'));