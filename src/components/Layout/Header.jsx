import NotificationList from '../Notification/NotificationList';

// Trong phần AppBar
<AppBar position="fixed">
  <Toolbar>
    // ... other components
    <NotificationList />
    // ... other components
  </Toolbar>
</AppBar> 

function Header() {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={handleDrawerToggle}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Thư Viện Online
        </Typography>

        <NotificationList />

        <UserMenu />
      </Toolbar>
    </AppBar>
  );
} 