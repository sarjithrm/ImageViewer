import React, {Component} from 'react';
import './Login.css';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import { withStyles } from '@material-ui/core/styles';
import Header from '../../common/header/Header';

const styles = theme => ({
    root: {
        minWidth: 240,
        maxWidth: 350,
        margin: "auto",
        padding: "20px"
    },
    loginBtn: {
        cursor: "pointer"
    }
});

class Login extends Component{
    
    constructor(){
        super();
        this.state = {
            username: "",
            password: "",
            usernameRequired: "displayNone",
            passwordRequired: "displayNone",
            userAndPass: "displayNone",
            access_token: "IGQVJYeXl4UFhGeGx6ZAWcxUkJEdUxSS1FrdGN5TjNLUExYN1p6Q2M4VkpZARWdJSzFpTEtRbXRtUFQ0MnFMZAUU0ak9Qa1ltTVI5dUNxVW9Rc3FLZAEVzSU1QMTdpVmV5bGlPQk4tUzRyTHZANM1BwTjhXUzR0SFdIemFWbEcw",
        }
    }

    usernameChangeHandler = (e) =>{
        this.setState({username: e.target.value});
    }

    passwordChangeHandler = (e) =>{
        this.setState({password: e.target.value});
    }

    loginClickHandler = () =>{
        this.state.username === "" ? this.setState({usernameRequired: "displayBlock"}) : this.setState({usernameRequired: "displayNone"});
        this.state.password === "" ? this.setState({passwordRequired: "displayBlock"}) : this.setState({passwordRequired: "displayNone"});

        let username = "admin";
        let password = "admin@123";
        let access_token = this.state.access_token;

        if( this.state.username === username && this.state.password === password){
            sessionStorage.setItem("access-token", access_token);
            this.setState({userAndPass: "displayNone"});
            this.props.history.push({
                pathname: '/home'
            })
        }else{
            if( this.state.username !== "" && this.state.password !== "" ){
                this.setState({userAndPass: "displayBlock"});
            }
        }
    }

    render(){
        const { classes } = this.props;
        return(
            <div>
                <Header loggedIn="0" profile="0" paths={this.props}/>
                <div className="login">
                    <Card className={classes.root}>
                        <CardContent>
                            <FormControl>
                                <Typography variant="headline" component="h2">
                                    LOGIN
                                </Typography>
                            </FormControl>
                            <br/><br/>
                            <FormControl required fullWidth="true">
                                <InputLabel htmlFor="username"> Username </InputLabel>
                                <Input id="username" type="text" username={this.state.username} onChange={this.usernameChangeHandler}/>
                                <FormHelperText className={this.state.usernameRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br/><br/>
                            <FormControl required fullWidth="true">
                                <InputLabel htmlFor="password"> Password </InputLabel>
                                <Input id="password" type="password" password={this.state.password} onChange={this.passwordChangeHandler}/>
                                <FormHelperText className={this.state.passwordRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br/><br/>
                            <FormHelperText className={this.state.userAndPass}>
                                <span className="red">Incorrect username and/or password</span>
                            </FormHelperText>
                            <br/>
                            <Button variant="contained" color="primary" className={classes.loginBtn} onClick={this.loginClickHandler}>LOGIN</Button> 
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Login);