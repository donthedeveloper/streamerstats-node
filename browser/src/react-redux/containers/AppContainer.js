import React from 'react';
import {connect} from 'react-redux';

import Modal from '../components/Modal.jsx';
import {addSubscriber, updateErrorMessage} from '../reducers/subscriber';

class AppContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subscribeFormIsDirty: false, 
      modalIsOpen: false
    }

    this.handleEmailSubmit = this.handleEmailSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.cleanSubscribeForm = this.cleanSubscribeForm.bind(this);

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // TODO: incorrectly assumes only prop that will change is error message
    if (nextProps.errorMessage) { 
      this.dirtySubscribeForm() 
    } 
    else { 
      this.cleanSubscribeForm() 
    }
  }

  handleEmailSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const subscribeForm = {
      emailAddress: data.get('email')
    };

    this.props.addSubscriber(subscribeForm.emailAddress);
  }

  handleInputChange() {
    console.log('input changed');
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
                <input className='input-email' name='email' type='email' placeholder='Email Address' onChange={this.handleInputChange} />
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
            <p>Helloasd l;dfjkaksl;dfjaks dl;fjasasdfasdfs akdjflaskdfjlkasfjasld kfjlaskdfjdl;fj</p>
          </Modal>
          <ul>
            <li>
              <i className='fa fa-area-chart fa-2x' aria-hidden="true"></i>
              <p className='features-title'>Statistics with Google Charts</p>
              <p>Have you ever wondered how long lurkers really stay in your channel? View channel statistics in much more depth.</p>
            </li>
            <li>
              <i className='fa fa-eercast fa-2x' aria-hidden="true"></i>
              <p className='features-title'>Moderation tools with action logs</p>
              <p>Mark and see previously problem viewers, as well as users who have a positive impact on your community.</p>
            </li>
            <li>
              {/*<i className='fa fa-plus fa-2x features-custom-icon' aria-hidden="true"></i>
              <p className="features-title">Add your feature</p>*/}
              <button className='features-request-button' onClick={this.openModal}>Add your feature</button>
              <p>If we could build any tool that you needed as a streamer, what would it be?</p>
            </li>
            <li>
              {/* img, text */}
            </li>
            <li>
              {/* img, text */}
            </li>
            <li>
              {/* img, text */}
            </li>
          </ul>
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
  errorMessage: state.subscriber.errorMessage
});

const mapDispatchToProps = (dispatch) => ({
  addSubscriber: (emailAddress) => 
    dispatch(addSubscriber(emailAddress)), 
  clearErrorMessage: () => 
    dispatch(updateErrorMessage(""))
});

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
