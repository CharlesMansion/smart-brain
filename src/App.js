import React, { Component } from 'react';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Modal from './components/Modal/Modal';
import Profile from './components/Profile/Profile';

import './App.css';

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  isProfileOpen: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    age:'',
    pet:'',
    avatarurl:'',
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }


  componentDidMount = () => {
    const token = window.localStorage.getItem('token');
    if (token) {
      fetch('http://192.168.99.100:3000/signin', {
        method:'post',
        headers: {
          'Content-Type':'application/json',
          'Authorization': token
        }
      })
      .then(resp => resp.json())
      .then(data => {
        if (data && data.id) {
          fetch(`http://192.168.99.100:3000/profile/${data.id}`, {
            method:'get',
            headers: {
              'Content-Type':'application/json',
              'Authorization': token
            }
          })
          .then(resp => resp.json())
          .then(user => {
            if (user && user.id) {
              this.loadUser(user);
              this.onRouteChange('home');
            }
          })
        }
      })
      .catch(console.log)
    }
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      age: data.age,
      pet: data.pet,
      avatarurl: data.avatarurl,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
   if (data && data.outputs) {
    const clarifaiFacesRegions = data.outputs[0].data.regions.map((region)=> {
      return region.region_info.bounding_box
    })
  
    return clarifaiFacesRegions.map((dude, i) => {
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
      return {
          leftCol: clarifaiFacesRegions[i].left_col * width,
          topRow: clarifaiFacesRegions[i].top_row * height,
          rightCol: width - (clarifaiFacesRegions[i].right_col * width),
          bottomRow: height - (clarifaiFacesRegions[i].bottom_row * height)
         }
      })
  } return;
}

  displayFaceBox = (boxes) => {
    if (boxes) {
    this.setState({boxes:boxes})
  }
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
      fetch('http://192.168.99.100:3000/imageurl', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
           'Authorization': window.localStorage.getItem('token')
      },
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(data => data.json())
      .then(data => {
        if (data) {
          fetch('http://192.168.99.100:3000/image', {
            method: 'put',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': window.localStorage.getItem('token')
            },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(data => data.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })
            .catch(console.log)

        }
        this.displayFaceBox(this.calculateFaceLocation(data))
       

      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
     return this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  toggleModal = () => {
    this.setState(prevState => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen
    }))
  }

  myCallback = (dataFromChild) => {
        const user = {...this.state.user}
        user.avatarurl= dataFromChild;
        this.setState({user})
    }

  render() {
    const { user, isSignedIn, imageUrl, route, boxes, isProfileOpen} = this.state;
    return (
      <div className="App">
         <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation user={user} isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} toggleModal={this.toggleModal}/>
       {console.log(user)}
        {isProfileOpen && <Modal>
              <Profile callbackFromParent={this.myCallback} loadUser={this.loadUser} user={user} isProfileOpen={isProfileOpen} toggleModal={this.toggleModal}/>
              </Modal>}
        { route === 'home'
          ? <div>
              <Logo />
              <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
            </div>
          : (
             route === 'signin'
             ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
             : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;
