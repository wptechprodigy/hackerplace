import React, { useState, MouseEvent } from 'react';
import { Menu, MenuItemProps, Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

function NavMenu() {
  const pathname = window.location.pathname;
  const path = pathname === '/' ? 'home' : pathname.substr(1);
  
  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (
    _e: MouseEvent,
    { name }: MenuItemProps,
  ) => {
    if (name) {
      setActiveItem(name);
    }
  };

  return (
    <Menu pointing secondary size='massive' color='teal'>
      <Container>
        <Menu.Item
          name="home"
          active={activeItem === 'home'}
          onClick={handleItemClick}
          as={Link}
          to={'/'}
        />
        <Menu.Menu position="right">
          <Menu.Item
            name="login"
            active={activeItem === 'login'}
            onClick={handleItemClick}
            as={Link}
            to={'/login'}
          />
          <Menu.Item
            name="register"
            active={activeItem === 'register'}
            onClick={handleItemClick}
            as={Link}
            to={'/register'}
          />
        </Menu.Menu>

      </Container>
    </Menu>
  );
}

export default NavMenu;
