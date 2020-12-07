import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody,
    CardTitle, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody,
    Row, Col, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

function RenderComments(props) {
  const {comments, postComment, dishId} = props;
    if (props.isLoading) {
        return(
            <div className="container">
                <div className="row">            
                    <Loading />
                </div>
            </div>
        );
    }
    else if (props.errMess) {
        return(
            <div className="container">
                <div className="row">            
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        );
    }
    else if (props.dishId != null){
    return (
      <React.Fragment>
        <ul className="list-unstyled ">
          <Stagger in>
          {comments.map((comment) => {
              return (
                  <Fade in>
                  <li key={comment.id}>
                  <p>{comment.comment}</p>
                  <p>-- {comment.author} , {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}</p>
                  </li>
                  </Fade>
              );
          })}
          </Stagger>
        </ul>
        <CommentForm dishId={dishId} postComment={postComment} />
      </React.Fragment>
    );
  } else {
    return <div></div>;
  }
}

function RenderDish(props) {
  if (props.dish != null) {
    return (
      <React.Fragment>
        <FadeTransform
            in
            transformProps={{
                exitTransform: 'scale(0.5) translateY(-50%)'
            }}>
        <Card>
            <CardImg top src={baseUrl + props.dish.image} alt={props.dish.name} />
            <CardBody>
                <CardTitle>{props.dish.name}</CardTitle>
                <CardText>{props.dish.description}</CardText>
            </CardBody>
        </Card>
        </FadeTransform>
      </React.Fragment>
    );
  } else return <div></div>;
}

function DishDetails(props){
  return (
    <div className="container">
      <div className="row">
        <Breadcrumb>
          <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
          <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
        </Breadcrumb>
        <div className="col-12">
          <h3>{props.dish.name}</h3>
          <hr />
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-md-5 m-1">
          <RenderDish dish={props.dish}></RenderDish>
        </div>
        <div className="col-12 col-md-5 m-1">
          <RenderComments comments={props.comments}
            postComment={props.postComment}
            dishId={props.dish.id}
          />
        </div>
      </div>
    </div>
  );
}
const required = (val) => val && val.length;
const minLength = (len) => (val) => val && (val.length >= len);
const maxLength = (len) => (val) => !(val) || (val.length <= len);  
export class CommentForm extends Component {
    constructor(props) {
        super(props);  
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleModal = this.toggleModal.bind(this);  
        this.state = {
          isModalOpen: false
        };
    }

    toggleModal() {
      this.setState({
        isModalOpen: !this.state.isModalOpen
      });
    }
    handleSubmit(values) {
        console.log('Current State is: ' + JSON.stringify(values));
        // alert('Current State is: ' + JSON.stringify(values));
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
    }
    render() {
        return (
        <React.Fragment>
          <Button outline color="secondary" onClick={this.toggleModal}><span className="fa fa-pencil fa-lg" ></span> Submit Comment</Button>
          <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
            <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
            <ModalBody>
              <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                <Row className="form-group">
                    <Label htmlFor="rating" md={12}>Rating</Label>
                    <Col md={12}>
                    <Control.select model=".rating" name="rating"
                        className="form-control">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                    </Control.select>
                    </Col>
                </Row>
                <Row className="form-group">
                    <Label htmlFor="author" md={12}>Your Name</Label>
                    <Col md={12}>
                    <Control.text model=".author" id="author" name="author"
                        placeholder="Your Name"
                        className="form-control"
                        validators={{
                        required, minLength: minLength(3), maxLength: maxLength(15)
                        }}
                    />
                    <Errors
                        className="text-danger"
                        model=".author"
                        show="touched"
                        messages={{
                        required: 'Required',
                        minLength: 'Must be greater than 2 characters',
                        maxLength: 'Must be 15 characters or less'
                        }}
                    />
                    </Col>
                </Row>
                <Row className="form-group">
                    <Label htmlFor="message" md={12}>Comment</Label>
                    <Col md={12}>
                    <Control.textarea model=".comment" id="comment" name="comment"
                        rows="6"
                        className="form-control" />
                    </Col>
                </Row>
                <Row className="form-group">
                    <Col md={12}>
                    <Button type="submit" color="primary">
                        submit
                        </Button>
                    </Col>
                </Row>
                </LocalForm>
            </ModalBody>
          </Modal>
        </React.Fragment>
        );
    }
}
  
export default DishDetails;