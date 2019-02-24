import React, { Component } from 'react';
import './App.css';
import VideoDetail from './components/VideoDetail.js';
import VideoList from './components/VideoList.js';
import InfiniteScroll from 'react-infinite-scroll-component';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {  
      searchQuery: '', 
      videos: [],
      nextpagetoken:'',
      selectedVideo: null,
    };
  }

  handleChange= (event) => {
    this.setState({searchQuery: event.target.value});
  }

  componentDidMount(){
    this.search();
  } 

  search = () => {
    let { searchQuery } = this.state; 
    fetch(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyBXtV0uOCzjIrVXcOBlx8gZHaHf3dr1ExQ&part=snippet&type=video&maxResults=5&q=${searchQuery}`)
      .then(res => res.json())
      .then(
        (result) => {
          //console.log(result.pageInfo['resultsPerPage']);
          console.log(result);
          this.setState({
            //isLoaded: true,
            videos: result.items,
            nextpagetoken: result.nextPageToken,
            resultsPerPage: result.pageInfo['resultsPerPage'],
            total: result.pageInfo['totalResults']
          });
        },
        (error) => {
          this.setState({
            //isLoaded: true,
            error
          });
        }
      )
  }

  loadMore = () => {
    let { searchQuery } = this.state;
    console.log(this.state.total);
    var { nextpagetoken } = this.state;
    console.log(this.state.nextpagetoken);
    this.setState({ resultsPerPage: this.state.resultsPerPage });
    fetch(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyBXtV0uOCzjIrVXcOBlx8gZHaHf3dr1ExQ&part=snippet&type=video&maxResults=5&q=${searchQuery}&pageToken=${nextpagetoken}`)
      .then(res => res.json())
      .then((result) => {
        console.log(result);
        this.setState({ 
          nextpagetoken: result.nextPageToken,
          videos: this.state.videos.concat(result.items) 
        })
      });
  };

  enterPressed = (e) => {
    if (e.key === 'Enter') {
      this.search();
    }
  }
    
  handleVideoSelect = (video) => {
    this.setState({selectedVideo: video})
  }

  render() {
    return (
      <div className="container-fluid" style={{marginTop: '1em'}}>
        <nav className="navbar fixed-top navbar-light bg-light">
            <label style={{ display: "flex", width: '96%'}}>
              <input type="text" value={this.state.searchQuery} onKeyPress={this.enterPressed} onChange={this.handleChange} className="form-control" placeholder="Search" aria-label="Search" aria-describedby="basic-addon1"></input>
              <input className="btn btn-primary" type="button" value="Search" onClick={this.search} style={{ marginLeft: 10}}></input>
            </label>
        </nav>
        <div className="container-fluid" style={{ paddingTop: 100}}>
            <div className="row">
              <div className="col-5">
                <VideoDetail video={this.state.selectedVideo}/>
              </div>
              <InfiniteScroll
                dataLength={this.state.videos.length}
                next={this.loadMore}
                hasMore={true}
                loader={<h4>Loading...</h4>}
              >
                <div className="col-7">
                    <VideoList handleVideoSelect={ this.handleVideoSelect } videos={ this.state.videos }/>
                </div>
              </InfiniteScroll> 
            </div>
        </div> 
      </div>
    );
  }
}

export default App;
