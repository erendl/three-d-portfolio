import Nav from 'react-bootstrap/Nav';

function Navbar() {
  return (
    <Nav as="ul" className="navbar">
      <Nav.Item as="li">
        <Nav.Link eventKey="https://github.com/erendl">GitHub</Nav.Link>
      </Nav.Item>
      <Nav.Item as="li">
        <Nav.Link eventKey="https://www.linkedin.com/in/erenozdil/">LinkedIn</Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default Navbar;