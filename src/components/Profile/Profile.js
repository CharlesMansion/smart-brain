import React from 'react';
import './Profile.css';

class Profile extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			name:this.props.user.name,
			age:this.props.user.age,
			pet:this.props.user.pet,
			file:'',
			avatarurl:this.props.user.avatarurl
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
		fetch(`http://192.168.99.100:3000/profile/${this.props.user.id}`, {
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

componentDidUpdate(prevProps, prevState) {
  if (prevState.file === this.state.file) {
  return null
  }
  this.onAvatarUpload()
}

	sendurltoApp = () => {
		this.props.callbackFromParent(this.state.avatarurl)
		console.log(this.state.avatarurl)
	}
	

	setfileState = (event) => {this.setState({ file: event.target.files[0] },() => 
    console.log(this.state.file))}

	onAvatarUpload = () => {
   
    
    const fileName = this.state.file.name
 
    let formData = new FormData();
	formData.append('name', fileName);
    
    fetch('https://d4ir8zu3z8.execute-api.us-east-1.amazonaws.com/dev/avatar', {
          method:'post',
          body: formData
        })
      .then((stuff) => {
   		return stuff.json()})
		.then((datas) => {
			fetch(datas.input.body, {
          method:'put',
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          body: this.state.file
        })})
      .then(() => {
      	const s3url = `https://s3.amazonaws.com/smart-brain-avatar/${encodeURIComponent(fileName)}`
      	this.setState({avatarurl:s3url})
      })
      .then(() => {
      	this.sendurltoApp()
      })
		      .catch((err) => {
		        console.log(err)
		      });
		  };

 
  
	render() {
		const {toggleModal, user} = this.props;
		const {name, age, pet, avatarurl} = this.state;
		return (
	<div className='modal'>
	
		  <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center bg-white">
        <main className="pa4 black-80 w-80">
         <img
		      src={this.state.avatarurl}
		      className="h4 dib" alt="avatar"/>
		  



		  <form onSubmit={this.submitFile}>
		  <label className="pa3 shadow-5 h3 tc grow pointer hover-white w-100 bg-light-blue">
		  	<div>Upload new avatar</div>
		  	<input style={{visibility:'hidden'}} onChange={this.setfileState} type="file"/> 
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
      	  onClick={() => {this.onProfileUpdate({name, age, pet, avatarurl})}}
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