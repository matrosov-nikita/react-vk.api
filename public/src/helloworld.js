
var ProgressBar = React.createClass({ 
        render: function() {
            return (
               <div className='progress'>
                  <div className='progress-bar'
                       role='progressbar'
                       aria-valuenow='0'
                       aria-valuemin='0'
                       aria-valuemax='100'
                       style={{width: this.props.loadPercent+'%'}}>
                    {Number((this.props.loadPercent).toFixed(1))}%
                </div>
</div>
            );
        }
});

var MovieForm = React.createClass({

    getInitialState: function() {
        return {
            name: ""  
        };
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var groupName = this.state.name.trim();
        this.props.handleSubmitGroupName(groupName);
    },
    handleChangeName: function(e) {
        this.setState({name: e.target.value})
    },
    render: function() {
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit} className="row">
                    <input type="text" onChange={this.handleChangeName} className="col-md-4 form-control" placeholder="Название группы"/>
                    <button type="submit" className="btn btn-primary">Поиск</button>
                </form>
            </div>       
            );
    }
});

var MovieRow = React.createClass({
    render: function() {
        return (
                  <tr className="row">
                <td className="col-md-4"> {this.props.movie.text.split('<br>')[0]} </td>
                <td className="col-md-2"> <img src={this.props.movie.attachment.photo.src} alt="poster"/></td>
                <td className="col-md-4"> {this.props.movie.text.split('<br>').slice(1)}</td>
                <td className="col-md-2 likes"> {this.props.movie.likes.count} </td>         
                    </tr>                    
            );
    }
});

var MovieTable = React.createClass({
    getInitialState: function() {
        return {
            movies: [],
            currentLoadPercent: 0
             }
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
                            result = result.slice(1);
                                result = sortMoviesByLikes(result);
                                  if (self.state.movies.length === 0) {                          
                                        self.setState({movies: result.slice(0,20)});
                                        self.setState({currentLoadPercent: count/res*100}) 
                                    } else {
                                    self.setState({movies: chooseTop10(self.state.movies, result.slice(0))});
                                    var currentLoadValue = self.state.currentLoadPercent;
                                    self.setState({currentLoadPercent: currentLoadValue + count/res*100})
                                  }

                               return getPostsFromWallWithPause(groupName,count,index*count + count);
                        })
                    }, getPostsFromWall(groupName, count, 0));
                })
                .catch(console.error.bind(console));       
             },
    
    handleSubmitGroupName: function(groupName) {
        this.getWallPosts(groupName);
    },

    render: function() {
        var movieRows = this.state.movies.map((movie)=> {
            return (
                <MovieRow movie={movie} key={movie.id} />
                )
        })
        return (
            <div className="container">
                <ProgressBar loadPercent={this.state.currentLoadPercent}/>
                <MovieForm handleSubmitGroupName={this.handleSubmitGroupName}/>
                <table className="table table-striped">
                    <thead className="row">
                        <th className="col-md-4">Название</th>
                        <th className="col-md-2">Постер</th>
                        <th className="col-md-4">Описание</th>
                        <th className="col-md-2 likes">Лайки</th>
                    </thead>
                    <tbody className="container">
                        {movieRows}
                    </tbody>
                </table>
             </div>
        );
    }
})

ReactDOM.render(<MovieTable movieURL ='/config.json' />, document.getElementById('box'));