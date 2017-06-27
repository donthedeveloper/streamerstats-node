import React from 'react';
import {connect} from 'react-redux';

import Modal from '../components/Modal.jsx';

import {addSubscriber, updateErrorMessage} from '../reducers/subscriber';
import {addFeature} from '../reducers/feature';

class AppContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subscribeFormIsDirty: false, 
      modalIsOpen: false
    }

    this.handleEmailSubmit = this.handleEmailSubmit.bind(this);
    this.handleEmailInputChange = this.handleEmailInputChange.bind(this);
    this.cleanSubscribeForm = this.cleanSubscribeForm.bind(this);

    this.handleFeatureSubmit = this.handleFeatureSubmit.bind(this);

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.forceCloseModal = this.forceCloseModal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // TODO: incorrectly assumes only prop that will change is error message
    if (nextProps.errorMessage) { 
      this.dirtySubscribeForm() 
    } 
    else { 
      this.cleanSubscribeForm() 
    }

    if (nextProps.features.length > this.props.features.length) {
      this.forceCloseModal();
    }
  }

  /********** SUBSCRIBE FORM **********/
  handleEmailSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const subscribeForm = {
      emailAddress: data.get('email')
    };

    this.props.addSubscriber(subscribeForm.emailAddress);
  }

  handleEmailInputChange() {
    if (this.state.subscribeFormIsDirty) {
      this.props.clearErrorMessage();
    }
  }

  cleanSubscribeForm() {
    this.setState({
      subscribeFormIsDirty: false
    });
  }

  dirtySubscribeForm() {
    this.setState({
      subscribeFormIsDirty: true
    });
  }


  /********** FEATURE FORM **********/
  handleFeatureSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const featureForm = {
      content: data.get('content')
    };

    this.props.addFeature(featureForm.content);
  }


  /********** MODAL **********/
  openModal() {
    this.setState({
      modalIsOpen: true
    });
  }

  closeModal(e) {
    // dont allow clicking of inner children to trigger close
    if (e.currentTarget === e.target) {
      this.setState({
        modalIsOpen: false
      });
    }
  }

  // TODO: closeModal needs to be simpler. Separate checks from the actual action.
  forceCloseModal() {
    this.setState({
      modalIsOpen: false
    })
  }

  render() {
    return (
      <div>
        <div className='intro'>
          <div className='intro-container'>
            <h1 className='title'>Streamer<span>Stats</span></h1>
            <div className='signup'>
              <p className='signup-slogan'>Grow Your Twitch Channel.</p>
              <p>StreamerStats is a web app, containing features and tools that help you grow and manage your Twitch channel.</p>
              <p>Subscribe to our newsletter to be notified when we launch.</p>
            
              { !this.props.subscribed && 
              <form onSubmit={this.handleEmailSubmit}>
                <input className='input-email' name='email' type='email' placeholder='Email Address' onChange={this.handleEmailInputChange} />
                { 
                  this.state.subscribeFormIsDirty && 
                  <input disabled className='input-submit--dirty' type='submit' value={ this.props.errorMessage } />
                }
                {
                  !this.state.subscribeFormIsDirty && 
                  <input className='input-submit' type='submit' value='Subscribe' />
                }
              </form>
              }
              { this.props.subscribed && 
              <p>Thank you! You have successfully been subscribed and will receive updates towards StreamerStats.</p>
              }
            </div>
          </div> 
        </div>
        <div className='features'>
          <Modal isOpen={this.state.modalIsOpen} closeModal={this.closeModal}>
            <form className='features-request-form' onSubmit={ this.handleFeatureSubmit }>
              <fieldset>
                <legend>Feature Request</legend>
                <textarea name='content' id='feature-content'></textarea>
                <label htmlFor='feature-content'>What feature would you like to see?</label>
              </fieldset>
              <input type='submit' />
            </form>
          </Modal>

          
          <ul className='features-list'>
            {
              this.props.features.map((feature, counter) => {
                const cssClass = (feature.userSubmitted) ? 'features-item--userSubmitted' : 'features-item';

                return (
                  <li className={cssClass} key={counter}>
                    <i className={`fa ${feature.faIconClass} fa-2x`} aria-hidden='true'></i>
                    <p className='features-title'>{feature.headerText}</p>
                    <p>{feature.contentText}</p>
                  </li>
                );
              })
            }
          </ul>
          <hr />
          <div className='features-request'>
            <h2>Request A Feature</h2>
            <p>If we could build any tool that you needed as a streamer, what would it be?</p>
            <button className='features-request-button' onClick={this.openModal}>Add your feature</button>
          </div>
        </div>
        <div className='gotya'>
          <div>
            <p>Hello!</p>
            <form>
              <input type='email' />
              <input type='submit' value='Submit' />
            </form>
          </div>
          <ul>
            {/*<li><a href='' target='_blank'><icon></li>
            <li><a href='' target='_blank'><icon></li>
            <li><a href='' target='_blank'><icon></li>*/}
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  subscribed: state.subscriber.subscribed, 
  errorMessage: state.subscriber.errorMessage, 
  features: state.feature.features
});

const mapDispatchToProps = (dispatch) => ({
  addSubscriber: (emailAddress) => 
    dispatch(addSubscriber(emailAddress)), 
  clearErrorMessage: () => 
    dispatch(updateErrorMessage("")), 
  addFeature: (content) => 
    dispatch(addFeature(content))
});

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
