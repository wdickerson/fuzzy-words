import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './fuzzy.scss';
import { uuid } from './uuid.js';
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'


class TitleHeader extends React.Component {
  constructor (props) {
    super(props);
    
    this.state = {
      editable : false
    }
  }

  toggleEditable = () => {
    console.log('lets toggle editable state');
    
    this.setState(state => {
      return {
        editable : !state.editable
      }
    });
  }
  
  updateStoryTitle = (e) => {
    this.props.updateStoryTitle(e.target.value);
  }
    
  render() {
    const editableTitle = (
      <div className="navbar-nav pl-2 pr-2 flex-grow-1">
        <div className="input-group">
          <input type="text" 
                 className="form-control" 
                 value={this.props.currentStoryTitle}
                 onChange={this.updateStoryTitle}
                 aria-label="Title" 
                 autofocus='true' />
          <div class="input-group-append">
            <span onClick={this.toggleEditable} class="input-group-text">&#x2713;</span>
          </div>
        </div>
      </div>
    );
    
    const staticTitle = (
      <div className="navbar-nav nav-story-title fuzzyable"
           onClick={this.toggleEditable}>
        {this.props.currentStoryTitle}  &#x270E;
      </div>
    );
    
    return this.state.editable ? editableTitle : staticTitle;
  }
}

class Toolbelt extends React.Component {
  toggleBlur = () => {
    console.log('lets do some jquery');
    $('.fuzzyable').toggleClass('fuzzy');
  }
  
  render() {
    
    const titleHeader = (
      <TitleHeader currentStoryTitle={this.props.currentStoryTitle} 
                   updateStoryTitle={this.props.updateStoryTitle} />
    );
    
    return (
      <div>
        <nav className="navbar navbar-light bg-light">
          <button className="navbar-toggler btn btn-outline-secondary" type="button" data-toggle="collapse" data-target="#shelf-collapse" aria-controls="shelf-collapse" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className='d-none d-md-flex justify-content-center flex-grow-1'>
            {titleHeader}
          </div>
          
          <button className="btn btn-outline-secondary" type="button" onClick={this.toggleBlur}>Fuzzy</button>

          <div className="collapse navbar-collapse" id="shelf-collapse">
            <Shelf stories={this.props.stories} 
                   refreshStoryList={this.props.refreshStoryList}
                   setCurrentStory={this.props.setCurrentStory}
                   deleteStory={this.props.deleteStory}
                   createNewStory={this.props.createNewStory} />
          </div>
        </nav>
        <nav className="navbar navbar-light bg-light d-md-none">
          <div className='d-flex justify-content-center flex-grow-1'>
            {titleHeader}
          </div>
        </nav>
      </div>
    );
  }
}

class Shelf extends React.Component {
  constructor (props) {
    super(props);
  }
  
  clearStorage = () => {
    console.log('clear storage!!');
    window.localStorage.clear();
    this.props.refreshStoryList();
  }
  
  render () {
    const titles = Object.keys(this.props.stories).map(s => {
      return (
        <li className="nav-item active">
          <div className='d-flex'>
            <a className="nav-link" 
               data-toggle="collapse" data-target="#shelf-collapse"
               onClick={this.props.setCurrentStory.bind(this, s)}>
                 {this.props.stories[s].title}
            </a>
            <a className="ml-2 small align-self-center"
               onClick={this.props.deleteStory.bind(this, s)}>
                 &#x1F5D1;
            </a>
          </div>
        </li>
      );
    })
    
    const newTitle = (
      <li className="nav-item active">
        <a className="nav-link" 
           data-toggle="collapse" data-target="#shelf-collapse"
           onClick={this.props.createNewStory}>
             New Story
        </a>
      </li>
    )
    
    const clearStorageButton = (
      <li className="nav-item active">
        <a className="nav-link" onClick={this.clearStorage}>Clear Storage</a>
      </li>
    )
    
    return (
      <ul id="shelf" className="navbar-nav mr-auto mt-2 mt-lg-0">
        {titles}
        {newTitle}
        {clearStorageButton}
      </ul>
    )
  }
}

class WritingPage extends React.Component {
  updateStoryText = (e) => {
    this.props.updateStoryText(e.target.value);
  }
  
  render() {
    return (
      <textarea id="writing-page"
                className='container-fluid fuzzyable mt-1'
                name='text' 
                value={this.props.currentStoryText}
                placeholder='Type here. Click "Fuzzy" to show/hide text.' 
                autocomplete='off' 
                autocorrect='off' 
                autocapitalize='off' 
                spellcheck='false' 
                onChange={this.updateStoryText} />
    )
  }
}

class Footer extends React.Component {
  render() {
    return (
      <div className='d-flex mt-2 pb-3 text-muted justify-content-center'>
        <div className='ml-1 mr-1'>A project by William Dickerson</div>
        <div className='ml-1 mr-1'>
          <a className='text-secondary' href='https://www.github.com/wdickerson'>
            <FontAwesomeIcon icon={faGithub} />
          </a>
        </div>
        <div className='ml-1 mr-1'>
          <a className='text-secondary' href='https://www.linkedin.com/in/wdickerson08'>
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
        </div>
        <div className='ml-1 mr-1'>|</div>
        <div className='ml-1 mr-1'>
          <a className='text-secondary' href='http://www.wdickerson.com/projects'>
            More projects
          </a>
        </div>
      </div>
    )
  }
}

class Workspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getStoriesFromLocal();
  }
  
  refreshStoryList = (currentStory) => {
    if (currentStory == null) {
      this.setState(this.getStoriesFromLocal());
    } else {
      const state = this.getStoriesFromLocal();
      state.currentStory = currentStory;
      this.setState(state);
    } 
  }
  
  getStoriesFromLocal = () => {    
    const stories = {};
    
    for (let i = 0; i < 500; i++) {
      const keyName = window.localStorage.key(i);
      if (keyName == null) break;
      
      if (keyName.startsWith('title')) {
        const storyId = keyName.substring(5);
        
        if (!stories[storyId]) stories[storyId] = {};
        stories[storyId].title = window.localStorage.getItem(keyName); 
      }
      
      if (keyName.startsWith('text')) {
        const storyId = keyName.substring(4);
        
        if (!stories[storyId]) stories[storyId] = {};
        stories[storyId].text = window.localStorage.getItem(keyName);
      } 
    }
    
    if (!Object.keys(stories).length) {
      const demoStory1 = uuid();
      const demoStory2 = uuid();   
      
      stories[demoStory1] = {
        title : "Welcome to Fuzzy Words!",
        text : 
`This is a place to write. Click "fuzzy" in the top right to blur the words and free your mind. Change stories with the menu button at the top left.

Don't keep anything important here. If you clear your browser history, stories might be lost.

Enjoy!`
      };
      
      stories[demoStory2] = {
        title : "St. Lucy's Home for Girls Raised by Wolves",
        text : 
`At first, our pack was all hair and snarl and floor-thumping joy. We forgot the barked cautions of our mothers and fathers, all the promises we'd made to be civilized and ladylike, couth and kempt.

A story by Karen Russell:
https://www.goodreads.com/book/show/47085.St_Lucy_s_Home_for_Girls_Raised_by_Wolves`
      };
      
      window.localStorage.setItem(`title${demoStory1}`, stories[demoStory1].title);
      window.localStorage.setItem(`text${demoStory1}`, stories[demoStory1].text);
      window.localStorage.setItem(`title${demoStory2}`, stories[demoStory2].title);
      window.localStorage.setItem(`text${demoStory2}`, stories[demoStory2].text);
    }
    
    return {
      currentStory : Object.keys(stories)[0],
      stories : stories
    };
  }
  
  setCurrentStory = s => {
    this.setState({
      currentStory : s
    })
  }
  
  deleteStory = i => {
    window.localStorage.removeItem(`title${i}`);
    window.localStorage.removeItem(`text${i}`);
    
    if (i == this.state.currentStory) {
      this.refreshStoryList();
    } else {
      this.refreshStoryList(this.state.currentStory);
    }
  }
  
  createNewStory = () => {
    this.setState((state) => {
      
      const newStoryId = uuid();
      const newTitle = 'My new story';
      const newText = 'Once upon a time...';
      
      window.localStorage.setItem(`title${newStoryId}`, newTitle);
      window.localStorage.setItem(`text${newStoryId}`, newText);
      
      state.stories[newStoryId] = { title : newTitle, text : newText};
      
      return {
        currentStory : newStoryId,
        stories : state.stories
      }
    });
  }
  
  updateStoryText = storyText => {
    this.setState(state => {
      
      window.localStorage.setItem(`text${state.currentStory}`, storyText);
      state.stories[state.currentStory].text = storyText;
      
      return {
        stories : state.stories
      };
    });
  }
  
  updateStoryTitle = storyTitle => {
    this.setState(state => {
      
      window.localStorage.setItem(`title${state.currentStory}`, storyTitle);
      state.stories[state.currentStory].title = storyTitle;
      
      return {
        stories : state.stories
      };
    });
  }
  
  render() {
    return (
      <div id='workspace' className='container'>
        <Toolbelt stories={this.state.stories} 
                  currentStoryTitle={this.state.stories[this.state.currentStory].title}
                  refreshStoryList={this.refreshStoryList}
                  setCurrentStory={this.setCurrentStory}
                  deleteStory={this.deleteStory}
                  updateStoryTitle={this.updateStoryTitle}
                  createNewStory={this.createNewStory} />
        <WritingPage currentStoryText={this.state.stories[this.state.currentStory].text}
                     updateStoryText={this.updateStoryText} />
        <Footer />
      </div>
    );
  }
}

ReactDOM.render(
  <Workspace />,
  document.getElementById('root')
);
