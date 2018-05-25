import React, { Component } from "react";
import ResourceContainer from "../../components/Grid/ResourceContainer.js";
import { Form, Dropdown, Table, Button, Icon } from "semantic-ui-react";
import AddResourceModal from "../../components/Modal/AddResource.js";
import FooterDiv from "../../components/Footer/Footer.js";
import TechnologyDropDown from "../../components/TechnologyDropDown/TechnologyDropDown.js";
import API from "../../utils/API";

class ResourcePage extends Component {
  state = {
    resources: [],
    technologySelected: ""
  };

  deleteResource = id => {
    API.deleteResource(id)
      .then(res => this.loadResource())
      .catch(err => console.log(err));
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  setTechnologySelected = data => {
    this.setState({
      technologySelected: data
    });
  };

  //===================================================
  // DataBase Retrival Functions

  handleTechnologySelection = event => {
    event.preventDefault();
    this.loadResources({ id: this.state.technologySelected });
  };

  loadResources = technology => {
    API.getResources(technology)
      .then(res => {
        this.setState({ resources: res.data });
      })
      .catch(err => console.log(err));
  };

  //===================================================

  handleFormSubmit = event => {
    event.preventDefault();
    if (this.state.name) {
      API.saveResource({
        name: this.state.name,
        description: this.state.description
      })
        .then(res => this.loadResource())
        .catch(err => console.log(err));
    }
  };

  handleAddPortfolio = (event, props) => {
    event.preventDefault();
    const resources = this.state.resources.filter(
      resource => resource.id !== props.id
    );
    this.setState({ resources });
    var userId = window.sessionStorage.getItem("user_id");
    API.addResourceToPortfolio({
      userId: userId,
      resourceId: props.id
    })
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };

  resourcesTable = () => (
    <Table
      celled
      className="ui unstackable table"
      style={{
        width: "80%",
        align: "center",
        margin: "auto",
        marginTop: "15px"
      }}
    >
      <Table.Header>
      <Table.Row>
      <Table.HeaderCell colSpan='3'>
       <h2 style={{padding: "0px", marginTop: "0px", marginBottom: "0px"}}> Resources</h2></Table.HeaderCell>
       </Table.Row>
        <Table.Row>
          <Table.HeaderCell width={2}>Portfolio</Table.HeaderCell>
          <Table.HeaderCell width={6}>URL</Table.HeaderCell>
          <Table.HeaderCell width={6}>Description</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {this.state.resources.length ? (
          this.state.resources.map(resource => (
            <Table.Row key={resource._id}>
              <Table.Cell>
                <Button
                  className="blue"
                  id={resource._id}
                  onClick={this.handleAddPortfolio}
                >
                  Add to Portfolio
                </Button>
              </Table.Cell>
              <Table.Cell>{resource.url}</Table.Cell>
              <Table.Cell>{resource.description}</Table.Cell>
            </Table.Row>
          ))
        ) : (
          <Table.Row />
        )}
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan="3" />
        </Table.Row>
      </Table.Footer>
    </Table>
  );

  render() {
    return (
      <div>
        <ResourceContainer /> 
        <Form style={{ marginLeft: "20px" }}>
          <TechnologyDropDown
            setTechnologySelected={data => this.setTechnologySelected(data)}
          />
          <Button
            style={{ marginLeft: "20px", marginTop: "10px" }}
            className="large blue"
            type="submit"
            disabled={!this.state.technologySelected}
            onClick={this.handleTechnologySelection}
          >
            Search
          </Button>
          <AddResourceModal />
        </Form>

        <hr />
        <this.resourcesTable />
        <FooterDiv />
      </div>
    );
  }
}

export default ResourcePage;
