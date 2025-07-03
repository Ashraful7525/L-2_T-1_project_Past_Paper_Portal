import { Typography, List, ListItem, ListItemButton, ListItemText, Divider } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2, color: "#ff4500", fontFamily: "Arial Rounded MT Bold, Arial, sans-serif" }}>
        <span style={{ color: "#ff4500" }}>r/</span>PastPapers
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/">
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/submit">
            <ListItemText primary="Submit Question" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 14 }}>
        Welcome to the Past Paper Portal!  
        Use the filters to find questions by department, course, level, or term.
      </Typography>
    </>
  );
}
