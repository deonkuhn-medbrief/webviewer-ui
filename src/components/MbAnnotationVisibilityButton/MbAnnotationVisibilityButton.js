import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import StatefulButton from 'components/StatefulButton';

import selectors from 'selectors';
import FireEvent from 'helpers/fireEvent';

class MbAnnotationVisibilityButton extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    annotation: PropTypes.object.isRequired
  }

  getAnnotationVisibilityMount = () => {
    const { annotation } = this.props;

    return update => {
      this.setState({
        update
      });

      if (annotation.mbVisibility === 'public') {
        return 'StatePublic';
      } else {
        return 'StatePrivate';
      }
    };
  }

  componentDidMount() {
    window.addEventListener('annotationVisibilityChanged', this.onAnnotationVisibilityChanged);  
  }

  componentWillUnmount() {
    window.removeEventListener('annotationVisibilityChanged', this.onAnnotationVisibilityChanged);
  }

  componentDidUpdate() {
    const { annotation } = this.props; 

    if (this.state) {
      const { update } = this.state;
      if (annotation.mbVisibility === 'public') {
        update('StatePublic');
      } else {
        update('StatePrivate');
      }
    }  
  }

  onAnnotationVisibilityChanged = e => {
    const { annotation } = this.props;
    const { update } = this.state;
    
    if (e.detail.activeState.annotation.Id === annotation.Id) {
      if (annotation.mbVisibility === 'public') {
        update('StatePublic');
      } else {
        update('StatePrivate');
      }
    } 
  }

  getAnnotationVisibilityStates = () => {
    const { annotation } = this.props;

    return {
      StatePrivate: {
        onClick: (update, activeState) => {
          annotation.mbVisibility = 'public';
          update('StatePublic');
          FireEvent('annotationVisibilityChanged', { activeState });
        },
        title: 'Visible to My Firm only',
        img: 'mb_padlock',
        annotation
      },
      StatePublic: {
        onClick: (update, activeState) => {
          annotation.mbVisibility = 'private';
          FireEvent('annotationVisibilityChanged', { activeState });
          update('StatePrivate');
        },
        title: 'Visible to Everyone',
        img: 'mb_multiple_user',
        annotation
      }
    };
  }

  render() {
    const { isDisabled } = this.props;
    
    if (isDisabled) {
      return null;
    }

    return (
      <div className="mbVisibility">
        <StatefulButton dataElement="mbAnnotationVisibilityButton" initialState="StatePrivate" mount={this.getAnnotationVisibilityMount()} states={this.getAnnotationVisibilityStates()} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  isDisabled: selectors.isElementDisabled(state, ownProps.dataElement)
});

export default connect(mapStateToProps)(MbAnnotationVisibilityButton);