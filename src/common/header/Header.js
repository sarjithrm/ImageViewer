import React, {Component} from 'react';
import './Header.css';
import profile from '../../assets/profile.jpg';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

class Header extends Component{
    constructor(){
        super();
        this.state = {
            anchorEl: null,
            profile_picture: profile,
        }
    }

    logoutClickHandler = () => {
        this.setState({ anchorEl: null});
        sessionStorage.clear();
        window.location = "http://localhost:3000/";
    }

    profileClickHandler = () => {
        this.props.paths.history.push({
            pathname: '/profile',
            feed: this.props.posts
        })
    }

    logoClickHandler = () => {
        this.props.paths.history.push({
            pathname: '/home'
        })
    }

    searchChangeHandler = (event) => {
        this.props.searchPostHandler(event.target.value);
    }

    render(){
        const open = Boolean(this.state.anchorEl);

        const handleMenu = (event) => {
            this.setState({ anchorEl: event.currentTarget});
        };

        const handleClose = () => {
            this.setState({ anchorEl: null});
        };

        return(
            <div>
                <header className="app-header">
                    <Typography className="logo" component="h6" onClick={this.logoClickHandler}>
                        Image Viewer
                    </Typography>
                        { this.props.loggedIn === "1" && 
                        <div className="search">
                            <div className="searchIcon">
                                <SearchIcon />
                            </div>
                            <Input
                                placeholder="Search…"
                                className="inputInput"
                                inputProps={{ 'aria-label': 'search' }}
                                disableUnderline="true"
                                onChange={(event) => this.searchChangeHandler(event)}
                            />
                        </div>
                        }
                        { ( this.props.loggedIn === "1" || this.props.profile === "1" )&& 
                        <div className={ this.props.profile === "1" ? "profile-account" : "profile"}>
                            <IconButton aria-controls="menu-appbar" aria-haspopup="true" onClick={handleMenu}>
                                <img className="avatar" src={this.state.profile_picture} alt="profile"/>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={this.state.anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                                }}
                                open={open}
                                onClose={handleClose}
                            >
                                { this.props.loggedIn === "1" &&
                                    <MenuItem onClick={this.profileClickHandler}>My Account</MenuItem>
                                }
                                <MenuItem onClick={this.logoutClickHandler}>Logout</MenuItem>
                            </Menu>
                        </div>
                        }      
                </header>
            </div>
        )
    }
}

export default Header;