import React, { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Settings, AddBox, Inventory2, Favorite, ExpandMore, ViewList } from '@mui/icons-material';
import '../styles/leftpane.css';

const menuItems = [
  {
    name: "All Items",
    icon: <ViewList />,
    path: "/items/all",
  },
  {
    name: "Bike Accessories",
    icon: <Settings />,
    items: [
      { name: "Helmets", path: "/items/Bike Accessories/Helmets" },
      { name: "Lights", path: "/items/Bike Accessories/Lights" },
      { name: "Stickers", path: "/items/Bike Accessories/Stickers" },
      { name: "Tyres", path: "/items/Bike Accessories/Tyres" },
      { name: "Shock Absorbers", path: "/items/Bike Accessories/Shock Absorbers" },
      { name: "Gloves", path: "/items/Bike Accessories/Gloves" },
    ],
  },
  {
    name: "Three Wheeler Accessories",
    icon: <AddBox />,
    items: [
      { name: "Seat Sets", path: "/items/Three Wheeler Accessories/Seat sets" },
      { name: "Tyres", path: "/items/Three Wheeler Accessories/Tyres" },
      { name: "Battery", path: "/items/Three Wheeler Accessories/Battery" },
    ],
  },
  {
    name: "Cart",
    icon: <Home />,
    path: "/cart",
  },
  {
    name: "My Orders",
    icon: <Inventory2 />,
    path: "/userorders",
  },
  {
    name: "About Us",
    icon: <Favorite />,
    path: "/about",
  },
  {
    name: "Settings",
    icon: <Settings/>,
    path: "/settings"
  }
];

const NavButton = ({ onClick, name, icon, isActive, hasSubNav, path }) => (
  <NavLink
    to={path || '#'}
    className={isActive ? 'active' : ''}
    onClick={() => onClick(name)}
  >
    {icon}
    <span>{name}</span>
    {hasSubNav && <ExpandMore />}
  </NavLink>
);

const SubMenu = ({ item, activeItem, handleClick }) => {

  const navRef = useRef(null);

  const isSubNavOpen = (item, items) =>
    items.some((i) => i.name === activeItem) || item === activeItem;

  return (
    <div
      className={`sub-nav ${isSubNavOpen(item.name, item.items || []) ? 'open' : ''}`}
      style={{
        height: !isSubNavOpen(item.name, item.items || [])
          ? 0
          : navRef.current?.clientHeight,
      }}
    >
      <div ref={navRef} className="sub-nav-inner">
        {item?.items?.map((subItem) => (
          <NavButton
            key={subItem.name}
            onClick={handleClick}
            name={subItem.name}
            isActive={activeItem === subItem.name}
            path={subItem.path}
          />
        ))}
      </div>
    </div>
  );
};

const LeftPane = () => {
  const [activeItem, setActiveItem] = useState('');

  const handleClick = (item) => {
    setActiveItem(item !== activeItem ? item : '');
  };

  return (
    <aside className="sidebar">
      {menuItems.map((item) => (
        <div key={item.name}>
          {!item.items ? (
            <NavButton
              onClick={handleClick}
              name={item.name}
              icon={item.icon}
              isActive={activeItem === item.name}
              hasSubNav={!!item.items}
              path={item.path}
            />
          ) : (
            <>
              <NavButton
                onClick={handleClick}
                name={item.name}
                icon={item.icon}
                isActive={activeItem === item.name}
                hasSubNav={!!item.items}
              />
              <SubMenu
                activeItem={activeItem}
                handleClick={handleClick}
                item={item}
              />
            </>
          )}
        </div>
      ))}
    </aside>
  );
};

export default LeftPane;

