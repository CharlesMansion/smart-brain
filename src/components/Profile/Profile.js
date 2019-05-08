import React from 'react';
import './Profile.css';

class Profile extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			name:this.props.user.name,
			age:this.props.user.age,
			pet:this.props.user.pet,
			file:''
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
			  headers: {
              'Content-Type': 'application/json',
              'Authorization': window.localStorage.getItem('token')
            },
			body:JSON.stringify({formInput:data})
		}).then(resp => {
			if (resp.status === 200 || resp.status === 304) {
			this.props.toggleModal();
			this.props.loadUser({...this.props.user, ...data});
		}
		}).catch(console.log)
	}

	onAvatarUpload = (event) => {
    this.setState({ file: event.target.files });
  };

  	submitFile = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', this.state.file[0]);
    fetch('https://your-api-endpoint.com/upload', {
          method:'post',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body:formData 
        })
      .then((response) => {
        // handle your response
      })
      .catch(() => {
        // handle your error
      });
  };

	render() {
		const {toggleModal, user} = this.props;
		const {name, age, pet} = this.state;
		return (
	<div className='modal'>
	{console.log(this.state)}
		  <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center bg-white">
        <main className="pa4 black-80 w-80">
         <img
		      src="http://tachyons.io/img/logo.jpg"
		      className="h3 w3 dib" alt="avatar"/>
		  



		  <form onSubmit={this.submitFile}>
		  <label className="b tc pa2 grow pointer hover-white w-60 bg-light-blue b--black-20">
		  	<span>Upload new avatar</span>
		  	<input style={{display:'none'}} onChange={this.onAvatarUpload} type="file"/> 
		  </label>
		  </form>
		  <h1>{name}</h1>
		  <h4>{`Images Submitted:${user.entries}`}</h4>
		  <p>{`Member since : ${new Date(user.joined).toLocaleDateString()}`}</p>
		  <p>{`Age : ${age}`}</p>
		  <p>{`Pet : ${pet}`}</p>
		  <hr/>
          <div className="measure">
                <label className="mt2 fw6" htmlFor="user-name">Name:</label>
                <input
                  onChange={this.onFormChange}
                  className="pa2 ba w-100"
                  type="text"
                  placeholder={name}
                  name="user-name"
                  id="user-name"  
                />
              
               <label className="mt2 fw6" htmlFor="user-name">Age:</label>
                <input
                  onChange={this.onFormChange}
                  className="pa2 ba w-100"
                  type="text"
                  placeholder={age}
                  name="age"
                  id="age"  
                />
             
               <label className="mt2 fw6" htmlFor="user-name">Pet:</label>
                <input
                  onChange={this.onFormChange}
                  className="pa2 ba w-100"
                  type="text"
                  placeholder={pet}
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