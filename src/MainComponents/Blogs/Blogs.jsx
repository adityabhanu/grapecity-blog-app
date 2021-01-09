import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../../Common/css/Login.css'
import '../../Common/css/Blogs.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { withRouter } from 'react-router-dom';
import { Modal } from 'react-bootstrap'

//Blog Component for displaying logged in user's blogs & modify it.
//Logout funtionality

class Blogs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: -1,
            userEmail: "",
            userBlogs: [],
            showModal: false,
            selectedBlogID: -1,
            selectedBlogTitle: "",
            selectedBlogDesc: "",
            modalHeading: "Add Blog",
            selectedIndex: -1,
            sortAscending: true


        }


    }

    //For fetching user's blog details
    componentDidMount() {

        const loggedUserName = localStorage.getItem("userName");
        const loggedUserID = localStorage.getItem("userID");
        console.log(loggedUserName, loggedUserID)
        if (!loggedUserName) {
            this.props.history.push('/login');
        }
        else {
            this.setState({
                userEmail: loggedUserName,
                userID: loggedUserID
            })

            if (localStorage.getItem("userBlogs")) {
                this.setState({
                    userBlogs: JSON.parse(localStorage.getItem("userBlogs"))
                })
            }
            else {
                fetch('blogsData.json',
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    }
                )
                    .then(response => response.json())
                    .then(data => {
                        const userBlogsData = data.Blogs.filter(data => data.userid == loggedUserID)
                        localStorage.setItem('userBlogs', JSON.stringify(userBlogsData))
                        this.setState({
                            userBlogs: userBlogsData
                        })
                    }
                    )
                    .catch(err => console.log("something went wrong", err));
            }
        }

    }

    //Used for logging out of application
    logoutClickHandler = () => {
        console.log(this.state.userEmail + "   " + this.state.userID)
        localStorage.clear();
        this.props.history.push('/login')
    }

    //Used for closing Add & Edit Blog Modals
    closeModal = () => {
        this.setState({
            showModal: false
        })
    }

    //Used for setting state values for Adding & Editing Blog Modals
    addupdateHandler = (heading, index, blogID, blogTitle, blogDesc) => {
        this.setState({
            selectedIndex: index,
            selectedBlogID: blogID,
            selectedBlogTitle: blogTitle,
            selectedBlogDesc: blogDesc,
            showModal: true,
            modalHeading: heading
        })
    }

    //Used for adding new blog and editing the eisitng blogs
    saveAndClose = () => {
        if (!this.state.selectedBlogTitle || !this.state.selectedBlogDesc)
            alert("Please enter Blog Title & Blog Description")
        else {
            var allBlogID = [];
            this.state.userBlogs.map(data => allBlogID.push(data.blogID));
            var maxBlogID = Math.max(...allBlogID);
            var obj = [];
            obj = [...this.state.userBlogs];
            var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };

            console.log(new Date().toLocaleDateString("en-US", options))

            if (this.state.selectedBlogID === -1) {


                var data = {
                    "blogID": maxBlogID + 1,
                    "userid": this.state.userID,
                    "title": this.state.selectedBlogTitle,
                    "description": this.state.selectedBlogDesc,
                    "creationDate": new Date().toLocaleDateString("en-US", options)

                }

                obj.push(data)

            }
            else {
                var data = {
                    "blogID": this.state.selectedBlogID,
                    "userid": this.state.userID,
                    "title": this.state.selectedBlogTitle,
                    "description": this.state.selectedBlogDesc,
                    "creationDate": new Date().toLocaleDateString("en-US", options)

                }

                obj[this.state.selectedIndex] = data;

            }

            localStorage.setItem("userBlogs", JSON.stringify(obj))

            this.setState({
                userBlogs: obj,
                showModal: false,
                selectedBlogTitle: "",
                selectedBlogDesc: ""
            })

        }

    }

    //Used for deleting an exisitng Blog
    deleteHandler = (index) => {

        var obj = [...this.state.userBlogs];

        obj.splice(index, 1);


        if (window.confirm("Do you want to delete the blog?")) {
            this.setState({
                userBlogs: obj
            })

            localStorage.setItem("userBlogs", JSON.stringify(obj));
        }

    }


    //Used for sorting the blogs in ascending & descending order
    sortHandler = () => {

        var sortBlogs = [...this.state.userBlogs];


        if (this.state.sortAscending) {
            sortBlogs.sort((a, b) => {
                console.log(a.creationDate)
                console.log(b.creationDate)
                console.log(new Date(a.creationDate))
                console.log(new Date(b.creationDate))
                return new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime()

            })
        }
        else {
            sortBlogs.sort((a, b) => {
                console.log(a + "  " + b)

                return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()

            })
        }
        console.log("sort ", sortBlogs)
        this.setState({
            sortAscending: !this.state.sortAscending,
            userBlogs: sortBlogs

        })


    }

    //Used for updating state Title & Description Details for seleceted blogs
    onChange = (e, value) => {
        this.setState({
            [e.target.name]: value
        })
    }
    render() {
        return (
            <div className="Blogs">
                <div className="header-container">
                    <div className="blogs-header">
                        <label style={{ fontSize: "40px" }}>Grapecity Blogs </label>
                        <div className="logout">
                            <label>{this.state.userEmail}</label>
                            <p className="btn-logout" onClick={this.logoutClickHandler}>Log Out</p>
                        </div>

                    </div>
                    <div className="form-row row-items btn-header">
                        <div className="col-xl-6 button-float">
                            <Button className="sort-button " block size="xs" onClick={() => this.sortHandler()}>
                                Sort
                            </Button>
                        </div>
                        <div className="col-xl-6 button-float">
                            <Button className="add-blog " block size="xs" onClick={() => this.addupdateHandler("Add Blog", -1, -1, "", "")}>
                                Add Blog
                            </Button>
                        </div>

                    </div>

                </div>


                <br />
                <br />
                <div className="blogsContainer">
                    {this.state.userBlogs.map((blogData, idx) => {
                        return (
                            <div className="blogs-card">
                                <div class="container">
                                    <h4><b>{blogData.title}</b></h4>
                                    <label>{blogData.creationDate}</label>
                                    <p>{blogData.description}</p>
                                    <div className="form-row blog-footer">
                                        <Button className="edit-blog" size="xs" onClick={() => this.addupdateHandler("Edit Blog", idx, blogData.blogID, blogData.title, blogData.description)}>
                                            Edit Blog
                                         </Button>
                                        <Button className="edit-blog" size="xs" onClick={() => this.deleteHandler(idx)}>
                                            Delete Blog
                                         </Button>
                                    </div>
                                </div>

                            </div>

                        )
                    })}
                </div>
                <div>
                    <Modal
                        show={this.state.showModal}
                        onHide={this.closeModal}
                        centered
                        dialogClassName="modal-lg"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id='ModalHeader'>{this.state.modalHeading}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="panelboxPlain">
                                <div className="form-group row">
                                    <label>Blog Title</label>
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="selectedBlogTitle"
                                        value={this.state.selectedBlogTitle}
                                        onChange={(e) => this.onChange(e, e.target.value)}

                                    />
                                </div>
                                <div className="form-group row">
                                    <label>Blog Description</label>
                                </div>
                                <div>
                                    <textarea style={{ height: "200px" }}
                                        type="text"
                                        className="form-control"
                                        name="selectedBlogDesc"
                                        value={this.state.selectedBlogDesc}
                                        onChange={(e) => this.onChange(e, e.target.value)}
                                    />
                                </div>



                            </div>
                        </Modal.Body>



                        <button className='btn btn-primary' onClick={this.saveAndClose}>
                            Save
            </button>

                    </Modal>
                </div>




            </div>
        )
    }

}

export default withRouter(Blogs);