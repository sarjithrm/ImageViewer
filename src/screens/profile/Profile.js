import React, {Component} from 'react';
import './Profile.css';
import Header from '../../common/header/Header';
import profile from '../../assets/profile.jpg';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Paper from '@material-ui/core/Paper';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import Modal from 'react-modal';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

const customStyles = {
    content : {
        minWidth: '40%',
        minHeight: '40%',
        width: '60%',
        height: '60%',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: "0px 10px 10px 10px"
    }
}

const styles = theme => ({
    edit: {
        borderRadius: "50%",
        cursor: "pointer",
        width: "30px",
        height: "50px"
    },
    info: {
        lineHeight: 0.5,
        padding: "0px 30px"
    },
    username: {
        fontSize: 20
    },
    imageModal: {
        display: "flex",
        justifyContent: "flex-start"
    },
    image: {
        padding: "5px"
    },
    imageDetails: {
        padding: "5px",
        width: "100%"
    },
    addBtn: {
        cursor: "pointer",
        marginLeft: 10
    }
});

class Profile extends Component{

    constructor(){
        super();
        this.state = {
            profile_picture: profile,
            posts: [],
            numberOfPosts: 0,
            username: "",
            name: "Sarjith R M",
            follows: 10,
            followed_by: 6,
            modalIsOpen: false,
            nameRequired: "displayNone",
            imageModalOpen: false,
            post: {"id": 0,
                "timestamp": "",
                "media_type": "",
                "images": {"standard_resolution": {"url" : "" }},
                "username": "",
                "caption": {"text":""},
                "tags": ["#Ride", " #Enjoy", " #HashTag"],
                "likes": { "count" : 5, "liked": false},
                "comments": [],
                "currentComment": "",
                "commentRequired": "displayNone"
            }
        }
    }

    openModalHandler = () => {
        this.setState({modalIsOpen: true, nameRequired: "displayNone"});
    }

    closeModalHandler = () =>{
        this.setState({modalIsOpen: false});
    }

    openImageModalHandler = (p) => {
        this.setState({post: p});
        this.setState({imageModalOpen: true});
    }

    closeImageModalHandler = () =>{
        this.setState({imageModalOpen: false});
    }

    componentWillMount(){
        if (sessionStorage.getItem("access-token") === null) {
            this.props.history.push({
                pathname: '/'
            })
        }
        this.setState({posts: this.props.location.feed});
        this.setState({username: this.props.location.feed[0]["username"]});

        let totalPosts = this.props.location.feed;
        this.setState({numberOfPosts: totalPosts.length});
    }

    updateClickHandler = () =>{
        let name    =   document.getElementById("fullname").value;
        if(name === ""){
            this.setState({nameRequired: "displayBlock"});
        }else{
            this.setState({nameRequired: "displayNone", name: name, modalIsOpen: false});
        }
    }

    likeClickHandler = () =>{
        let feed                =   this.state.post;
        if(feed.likes.liked === false){
            feed.likes.count                =   feed.likes.count + 1;
            feed.likes.liked                =   true;
        }else{
            feed.likes.count                =   feed.likes.count - 1;
            feed.likes.liked                =   false;
        }
        this.setState({post: feed});
    }

    commentChangeHandler = (event) =>{
        let post                    =   this.state.post;
        post.currentComment         =   event.target.value;
        this.setState({post: post});
    }

    addClickHandler = () =>{
        let post                =   this.state.post;
        if(post.currentComment === ""){
            post.commentRequired        =   "displayBlock";
            post.currentComment         =   "";
        }else{
            post.commentRequired        =   "displayNone";
            post.comments.push(post.currentComment);
            post.currentComment         =   "";
        }
        this.setState({post: post});
    }

    render(){
        const { classes } = this.props;
        return(
            <div>
                <Header loggedIn="0" profile="1" paths={this.props}/>
                <div className="account">
                    <Paper elevation={0}>
                        <div className="profile-info"> 
                            <img alt="profile" src={this.state.profile_picture} className="profile-pic" />
                            <div className={classes.info}>
                                <p className={classes.username}><b>{this.state.username}</b></p>
                                <ul>
                                    <li className="x">Posts: {this.state.numberOfPosts}</li>
                                    <li className="y">Follows: {this.state.follows}</li>
                                    <li className="z">Followed By: {this.state.followed_by}</li>
                                </ul>
                                <p><span style={{ fontSize: 20 }}>{this.state.name}</span> <Button className={classes.edit} variant="contained" color="secondary" size="small" onClick={this.openModalHandler}><EditIcon style={{ fontSize: 25 }}/></Button></p>
                            </div>
                        </div>
                        <Modal ariaHideApp={false} isOpen={this.state.modalIsOpen} contentLabel="Edit Name" onRequestClose={this.closeModalHandler} style={customStyles}>
                            <p style={{ fontSize: 25 }}>Edit</p>
                            <FormControl required>
                                <InputLabel htmlFor="fullname"> Full Name </InputLabel>
                                <Input id="fullname" type="text" fullname={this.state.name} />
                                <FormHelperText className={this.state.nameRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br/><br/><br/>
                            <Button variant="contained" color="primary" onClick={this.updateClickHandler}>UPDATE</Button>
                        </Modal>
                    </Paper>
                    <br/>
                    <GridList cellHeight={400} cols={3} className={classes.gridList}>
                        {this.state.posts.map((image) => (
                            <GridListTile className="gridTile" key={image.id} onClick={() => this.openImageModalHandler(image)}>
                               { (image.media_type === 'IMAGE'  || image.media_type === 'CAROUSEL_ALBUM' )&&
                                    <img src={image.images.standard_resolution.url} alt={image.caption.text} width="400" height="400"/>
                               } 
                               { image.media_type === 'VIDEO' &&
                                    <video autoPlay muted loop width="400" height="400">
                                        <source src={image.images.standard_resolution.url} type="video/mp4" />
                                        Your browser does not support the video tag
                                    </video>
                               }
                            </GridListTile>
                        ))}
                    </GridList>
                    <Modal ariaHideApp={false} isOpen={this.state.imageModalOpen} contentLabel="Image" onRequestClose={this.closeImageModalHandler} style={customStyles}>
                            <div className={classes.imageModal}>
                               <div className={classes.image}>
                               { (this.state.post.media_type === 'IMAGE'  || this.state.post.media_type === 'CAROUSEL_ALBUM' )&&
                                    <img src={this.state.post.images.standard_resolution.url} alt={this.state.post.caption.text} width="400" height="400"/>
                               } 
                               { this.state.post.media_type === 'VIDEO' &&
                                    <video autoPlay muted loop width="400" height="400">
                                        <source src={this.state.post.images.standard_resolution.url} type="video/mp4" />
                                        Your browser does not support the video tag
                                    </video>
                               }
                               </div>
                               <div className={classes.imageDetails}>
                                    <div className="post-header">
                                        <Avatar alt="profile" src={this.state.profile_picture} />
                                        <p style={{paddingLeft: 10}}>{this.state.username}</p>
                                    </div>
                                    <hr/>
                                    <div className="post-body">
                                        <Typography color="textPrimary" variant="headline" component="h4">
                                            {this.state.post.caption.text}
                                        </Typography>
                                        <Typography color="primary" variant="subtitle" component="p">
                                            {this.state.post.tags}
                                        </Typography>
                                        <br/>
                                        {this.state.post.comments.map((comment) => (
                                            <Typography color="textSecondary" variant="subtitle" component="p" key={this.state.post.id + "   " + comment} >
                                                <span><b>{this.state.post.username}:</b> {comment}</span>
                                            </Typography>
                                        ))}
                                    </div>
                                    <div className="post-footer">
                                        <span>
                                            <IconButton onClick={(() => this.likeClickHandler())}>
                                                { this.state.post.likes.liked === false &&
                                                    <FavoriteBorderOutlinedIcon/>
                                                }
                                                { this.state.post.likes.liked === true &&
                                                    <FavoriteIcon color="secondary"/>
                                                }
                                            </IconButton>
                                            {this.state.post.likes.count} likes
                                        </span>
                                        <div className="post-comment">
                                            <FormControl fullWidth>
                                                <InputLabel htmlFor="comment"> Add a comment </InputLabel>
                                                <Input id="comment" type="text" value={this.state.post.currentComment} onChange={((event) => this.commentChangeHandler(event))}/>
                                                <FormHelperText className={this.state.post.commentRequired}>
                                                    <span className="red">required</span>
                                                </FormHelperText>
                                            </FormControl>
                                            <Button variant="contained" color="primary" className={classes.addBtn} onClick={(() => this.addClickHandler())}>ADD</Button> 
                                        </div>
                                    </div>
                               </div>
                            </div>
                    </Modal>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Profile);