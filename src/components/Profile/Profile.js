import React from 'react';
import './Profile.css';

class Profile extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			name:this.props.name,
			age:this.props.age,
			pet:this.props.pet
		}
	}

	onFormChange = (event) => {
		switch(event.target.name) {
			case 'user-name' :
			this.setState({name:event.target.value})
			break;
			case 'age' :
			this.setState({age:event.target.value})
			break;
			case 'pet' :
			this.setState({pet:event.target.value})
			break;
			default:
			return;
		}
	}

	onProfileUpdate = (data) => {
		fetch(`http://localhost:3000/profile/${this.props.user.id}`, {
			method:'post',
			headers: {'Content-Type':'application/json'},
			body:JSON.stringify({formInput:data})
		}).then(resp => {
			this.props.toggleModal();
			this.props.loadUser({...this.props.user, ...data});
		}).catch(console.log)
	}

	render() {
		const {toggleModal, user} = this.props;
		const {name, age, pet} = this.state;
		return (
	<div className='modal'>
		  <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center bg-white">
        <main className="pa4 black-80 w-80">
         <img
		      src="http://tachyons.io/img/logo.jpg"
		      className="h3 w3 dib" alt="avatar"/>
		  <h1>{this.state.name}</h1>
		  <h4>{`Images Submitted:${user.entries}`}</h4>
		  <p>{`Member since : ${new Date(user.joined).toLocaleDateString()}`}</p>
		  <hr/>
          <div className="measure">
                <label className="mt2 fw6" htmlFor="user-name">Name:</label>
                <input
                  onChange={this.onFormChange}
                  className="pa2 ba w-100"
                  type="text"
                  placeholder={this.state.name}
                  name="user-name"
                  id="user-name"  
                />
              
               <label className="mt2 fw6" htmlFor="user-name">Age:</label>
                <input
                  onChange={this.onFormChange}
                  className="pa2 ba w-100"
                  type="text"
                  placeholder={user.age}
                  name="age"
                  id="age"  
                />
             
               <label className="mt2 fw6" htmlFor="user-name">Pet:</label>
                <input
                  onChange={this.onFormChange}
                  className="pa2 ba w-100"
                  type="text"
                  placeholder={user.pet}
                  name="pet"
                  id="pet"  
                />
          <div className="mt4" style={{display:'flex',justifyContent:'space-evenly'}}>
          <button 
      	  onClick={() => {this.onProfileUpdate({name, age, pet})}}
          className="b pa2 grow pointer hover-white w-40 bg-light-blue b--black-20">
          Save
          </button>
          <button 
          className="b pa2 grow pointer hover-white w-40 bg-light-red b--black-20" onClick={toggleModal}>
          Cancel
          </button>
          </div>
          </div>
        </main>
        <div className="modal-close" onClick={toggleModal}>&times;</div>
      </article>
	</div>
	);
	}

	 
}

export default Profile;