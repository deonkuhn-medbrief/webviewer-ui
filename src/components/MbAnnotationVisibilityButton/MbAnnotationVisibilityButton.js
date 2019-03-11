import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import core from 'core';

import StatefulButton from 'components/StatefulButton';

import selectors from 'selectors';
import FireEvent from 'helpers/fireEvent';

class MbAnnotationVisibilityButton extends React.PureComponent {
  static propTypes = {
    isMbVisibilityDisabled: PropTypes.bool,
    annotation: PropTypes.object.isRequired
  }

  constructor() {
    super();
  }

  getAnnotationVisibilityMount = () => {
      const { annotation } = this.props;

      if (this.state) {
        const { update } = this.state;
        if (annotation.mbVisibility == 'public') {
          update('StatePublic');
        } else {
          update('StatePrivate');
        }
      }

      return (update) => {
        this.setState({
          update: update
        });

        if (annotation.mbVisibility == 'public') {
            return 'StatePublic';
        } else {
            return 'StatePrivate';
        }
      }
  }

  componentDidMount() {
    window.addEventListener('annotationVisibilityChanged', this.onAnnotationVisibilityChanged);
  }

  componentWillUnmount() {
    window.removeEventListener('annotationVisibilityChanged', this.onAnnotationVisibilityChanged);
  }

  onAnnotationVisibilityChanged = e => {
    const {annotation} = this.props;
    const {update} = this.state;
    
    if (e.detail.activeState.annotation.Id == annotation.Id) {
      // annotation.mbVisibility = e.detail.activeState.annotation.mbVisibility;
      if (annotation.mbVisibility == 'public') {
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
            console.log('StatePrivate', annotation.mbVisibility, annotation.Id);
              annotation.mbVisibility = 'public';
              update('StatePublic');
              FireEvent('annotationVisibilityChanged', {'activeState': activeState});
            },
            title: 'Visible to My Firm only',
            img: 'mb_single_user',
            annotation: annotation
          },
          StatePublic: {
            onClick: (update, activeState) => {
              console.log('StatePublic', annotation.mbVisibility, annotation.Id);
              annotation.mbVisibility = 'private';
              FireEvent('annotationVisibilityChanged', {'activeState': activeState});
              update('StatePrivate');
          },
          title: 'Visible to All',
          img: 'mb_multiple_user',
          annotation: annotation
      }
    }
  }

  render() {
    const { isMbVisibilityDisabled, annotation } = this.props;
    
    console.log('render', annotation.mbVisibility, annotation.Id);

    return (
      <div className="mbVisibility">
      {!isMbVisibilityDisabled &&
        <StatefulButton dataElement="mbAnnotationVisibilityButton" mount={this.getAnnotationVisibilityMount()} states={this.getAnnotationVisibilityStates()} />
      }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  className: 'MbAnnotationVisibilityButton',
  // isDisabled: selectors.isElementDisabled(state, ownProps.dataElement),
  isMbVisibilityDisabled: selectors.isElementDisabled(state, 'mbAnnotationVisibilityButton')
});

export default connect(mapStateToProps)(MbAnnotationVisibilityButton);