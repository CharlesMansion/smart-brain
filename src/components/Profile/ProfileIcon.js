import React, {Component} from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import './ProfileIcon.css';

class ProfileIcon extends Component {
	constructor(props) {
		super(props);
		this.toggle = this.toggle.bind(this);
		this.state = {
			dropdownOpen:false,
			avatar:''
		}

	}

	toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

componentDidMount() {
	this.setState({avatar:this.props.user.avatarUrl})
}

componentDidUpdate(prevProps) {
 const newProps = this.props
 if (prevProps.user.avatarUrl !== newProps.user.avatarUrl) {
 	setTimeout(() => {this.setState({avatar:newProps.user.avatarUrl})}, 2000)
 }
 console.log(this.props.user)
}
 SignOutAndRevoke = () => {
 	fetch('http://192.168.99.100:3000/revoke', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        token: window.localStorage.getItem('token'),
        id: this.props.user.id
      })
    }) 
      .then(response => response.json()) 
 	 window.localStorage.removeItem('token')
 	 this.props.onRouteChange('signout')
 }

render() {
	return (
		<div className="pa4 tc">
		<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
	        <DropdownToggle
          tag="span"		
          data-toggle="dropdown"
          aria-expanded={this.state.dropdownOpen}
        >   
		  <img
		      src={this.state.avatar}
		      className="br-100 ba h3 w3 dib" alt="avatar"/>
        </DropdownToggle>
	    <DropdownMenu 
	        right
	        className="shadow-5 b--transparent" 
	        style={{marginTop:'20px', backgroundColor:'rgba(255,255, 255, 0.5)'}}>
	          <DropdownItem onClick={this.props.toggleModal}>View Profile</DropdownItem>
	          <DropdownItem onClick={() => {this.SignOutAndRevoke()}}>Sign Out</DropdownItem>
	
	        </DropdownMenu>
      </Dropdown>
	
	  </div>
		);
}
}

export default ProfileIcon;