import React, { useState, useEffect } from "react";
import { AppBar, Box, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [navItems, setNavItems] = useState<string[]>([]);
  

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("UserInfo") || "null");
    if (!userInfo) return;

    const roleName = userInfo.role;
    // Basic role-based nav items
    if (roleName === 'Admin') {
      setNavItems(["User", "Project", "Task"]);
    } else if (roleName === 'Manager') {
      setNavItems(["Project", "Task"]);
    } else {
      setNavItems(["Project", "Task"]);
    }
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleNavigation = (item: string) => {
    switch (item) {
      case "User":
        navigate("/users-list");
        break;
      case "Project":
        navigate("/projects-list");
        break;
      case "Task":
        navigate("/tasks-list");
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('token');
      localStorage.removeItem('UserInfo');
    } finally {
      navigate('/login');
    }
  };

  

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>Project Management System</Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }} onClick={() => handleNavigation(item)}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}>
            Project Management System
          </Typography>

          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => (
              <Button key={item} sx={{ color: "#fff" }} onClick={() => handleNavigation(item)}>
                {item}
              </Button>
            ))}
            <Button sx={{ color: "#fff", ml: 2 }} onClick={handleLogout}>Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: "block", sm: "none" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }}>
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
      </Box>
    </Box>
  );
};

export default Navbar;


