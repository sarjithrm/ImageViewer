import React, {Component} from 'react';
import Header from '../../common/header/Header';
import './Home.css';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import profile from '../../assets/profile.jpg';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    addBtn: {
        cursor: "pointer"
    },
    comment: {
        margin: "auto",
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
        alignContent: "center"
    },
    formControl: {
        width: "80%"
    }
});

class Home extends Component{
    constructor(){
        super();
        this.state = {
            accountId: "17841446206225920",
            posts: [],
            profile_picture: profile
        }
    }

    convertDate = (newDate) => {
        let postDate = new Date(newDate);
        let date = "";
        if(postDate.getDate() <= 9){
            date = date + "0" + postDate.getDate() + '/';
        }else{
            date = date + postDate.getDate() + '/';
        }
        if((postDate.getMonth() + 1) <= 9){
            date = date + "0" + (postDate.getMonth() + 1 )+ '/';
        }else{
            date = date + (postDate.getMonth() + 1 )+ '/';
        }
        date = date + postDate.getFullYear() + ' ';
        if(postDate.getHours() <= 9){
            date = date + "0" + postDate.getHours() + ':';
        }else{
            date = date + postDate.getHours() + ':';
        }
        if(postDate.getMinutes() <= 9){
            date = date + "0" + postDate.getMinutes() + ':';
        }else{
            date = date + postDate.getMinutes() + ':';
        }
        if(postDate.getSeconds() <= 9){
            date = date + "0" + postDate.getSeconds();
        }else{
            date = date + postDate.getSeconds();
        }
        return date;
    }

    getChildren = (imageId, post) => {
        let data = null;
        let xhr = new XMLHttpRequest();
        let postDetails = {}
        let that = this;
        xhr.addEventListener("readystatechange", function () {
            let feed = that.state.posts;
            if (this.readyState === 4) {
                let imageDetails            =   JSON.parse(this.responseText);
                postDetails["id"]           =   imageDetails["id"];
                postDetails["timestamp"]    =   that.convertDate(post["timestamp"]);
                postDetails["media_type"]   =   imageDetails["media_type"];
                postDetails["images"]       =   {"standard_resolution": {"url" : imageDetails["media_url"] }};
                postDetails["username"]     =   post["username"];
                postDetails["caption"]      =   { "text" : post["caption"]};
                postDetails["tags"]         =   ["#Ride", " #Enjoy", " #HashTag"];
                postDetails["likes"]        =   {"count" : 5, "liked": false};
                postDetails["comments"]     =   [];
                postDetails["currentComment"]   =   "";
                postDetails["commentRequired"]  =   "displayNone";
                postDetails["search"]           =   true;
                feed.push(postDetails);
            }
            that.setState({posts: feed});
        });
        xhr.open("GET", this.props.baseUrl + "/" + imageId + "?fields=id,media_url,timestamp,media_type&access_token=" + sessionStorage.getItem("access-token"));
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send(data);
    }

    componentWillMount(){
        if (sessionStorage.getItem("access-token") === null) {
            this.props.history.push({
                pathname: '/profile'
            })
        }

        let data = null;
        let xhr = new XMLHttpRequest();
        let that = this;
        xhr.addEventListener("readystatechange", function () {
            let feed    =   that.state.posts;
            if (this.readyState === 4) {
                for(let post of JSON.parse(this.responseText).data){
                    let postDetails = {}
                    if(post["media_type"] === "CAROUSEL_ALBUM"){
                        for(let image of post["children"]["data"]){
                            that.getChildren(image["id"], post);
                        }
                    }else{
                        postDetails["id"]           =   post["id"];
                        postDetails["timestamp"]    =   that.convertDate(post["timestamp"]);
                        postDetails["media_type"]   =   post["media_type"]
                        postDetails["images"]       =   {"standard_resolution": {"url" : post["media_url"] }};
                        postDetails["username"]     =   post["username"];
                        postDetails["caption"]      =   { "text" : post["caption"]};
                        postDetails["tags"]         =   ["#Ride", " #Enjoy", " #HashTag"];
                        postDetails["likes"]        =   { "count" : 5, "liked": false};
                        postDetails["comments"]     =   [];
                        postDetails["currentComment"]   =   "";
                        postDetails["commentRequired"]  =   "displayNone";
                        postDetails["search"]           =   true;
                        feed.push(postDetails);
                    }
                }
                that.setState({posts: feed});
            }
        });

        xhr.open("GET", this.props.baseUrl + "me/media?fields=" + this.state.accountId + ",caption,media_type,media_url,username,timestamp,children&access_token=" + sessionStorage.getItem("access-token"));
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send(data);
    }

    likeClickHandler = (event, post) =>{
        let feed                =   this.state.posts;
        let image               =   feed.indexOf(post);
        if(feed[image].likes.liked === false){
            feed[image].likes.count =   feed[image].likes.count + 1;
            feed[image].likes.liked =   true;
        }else{
            feed[image].likes.count =   feed[image].likes.count - 1;
            feed[image].likes.liked =   false;
        }
        this.setState({posts: feed});
    }

    commentChangeHandler = (event, post) =>{
        let feed                =   this.state.posts;
        let image               =   feed.indexOf(post);
        feed[image].currentComment  =   event.target.value;
        this.setState({posts: feed});
    }

    addClickHandler = (event, post) =>{
        let feed                =   this.state.posts;
        let image               =   feed.indexOf(post);
        if(feed[image].currentComment === ""){
            feed[image].commentRequired =   "displayBlock";
            feed[image].currentComment  =   "";
        }else{
            feed[image].commentRequired =   "displayNone";
            feed[image].comments.push(feed[image].currentComment);
            feed[image].currentComment  =   "";
        }
        this.setState({posts: feed});
    }

    searchPostHandler = (caption) => {
        let posts           = this.state.posts;
        let searchFeed      = []
        for(let post of posts){
            if(post.caption.text.toLowerCase().includes(caption.toLowerCase())){
                post.search = true;
            }else{
                post.search = false;
            }
            searchFeed.push(post);
        }
        this.setState({posts: searchFeed});
    }

    render(){

        const { classes } = this.props;

        return(
            <div>
                <Header loggedIn="1" profile="0" paths={this.props} posts={this.state.posts} searchPostHandler={this.searchPostHandler}/>
                <div className="feed">
                    {this.state.posts.filter(image => image.search === true).map((post) => (
                        <Card key={post.id} variant="outlined" className="posts">
                            <CardHeader 
                                avatar={
                                    <Avatar alt="profile" src={this.state.profile_picture} />  
                                }
                                title={post.username}
                                subheader={post.timestamp}
                            />
                            <CardContent>
                               { (post.media_type === 'IMAGE'  || post.media_type === 'CAROUSEL_ALBUM' )&&
                                    <img src={post.images.standard_resolution.url} alt="post" className="post"/>
                               } 
                               { post.media_type === 'VIDEO' &&
                                    <video className="post" autoPlay muted loop>
                                        <source src={post.images.standard_resolution.url} type="video/mp4" />
                                        Your browser does not support the video tag
                                    </video>
                               }
                               <hr/>
                               <Typography color="textPrimary" variant="headline" component="h4">
                                    {post.caption.text}
                                </Typography>
                                <Typography color="primary" variant="subtitle" component="p">
                                    {post.tags}
                                </Typography>
                                <br/>
                                <IconButton onClick={((event) => this.likeClickHandler(event, post))}>
                                    { post.likes.liked === false &&
                                        <FavoriteBorderOutlinedIcon/>
                                    }
                                    { post.likes.liked === true &&
                                        <FavoriteIcon color="secondary"/>
                                    }
                                </IconButton>
                                <span>{post.likes.count} likes</span>
                                <br/>
                                {post.comments.map((comment) => (
                                    <Typography color="textSecondary" variant="subtitle" component="p" key={post.id + "   " + comment} >
                                        <span><b>{post.username}:</b> {comment}</span>
                                    </Typography>
                                ))}
                                <br/>
                                <div className={classes.comment}>
                                    <FormControl fullWidth className={classes.formControl}>
                                        <InputLabel htmlFor="comment"> Add a comment </InputLabel>
                                        <Input id="comment" type="text" value={post.currentComment} onChange={((event) => this.commentChangeHandler(event, post))}/>
                                        <FormHelperText className={post.commentRequired}>
                                            <span className="red">required</span>
                                        </FormHelperText>
                                    </FormControl>
                                    <Button variant="contained" color="primary" className={classes.addBtn} onClick={((event) => this.addClickHandler(event, post))}>ADD</Button> 
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Home);