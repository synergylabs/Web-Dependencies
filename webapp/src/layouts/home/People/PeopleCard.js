import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import LanguageIcon from "@mui/icons-material/Language";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";

export const PeopleCard = (props) => {
  const { name, email, link } = props;

  return (
    <Grid item xs={12} md={3} lg={3}>
      <Card sx={{ height: "100%", boxShadow: "none" }}>
        {/* <CardMedia component="img" image={require(`../img/${imageName}`)} /> */}
        <CardContent>
          <Stack direction="column" justifyContent="center" alignItems="center">
            <Typography gutterBottom variant="h5" component="div">
              {name}
            </Typography>
            <Typography gutterBottom variant="body2" component="div">
              <Link href={`mailto:${email}`} color="inherit">
                {email}
              </Link>
            </Typography>
            <IconButton aria-label="link" href={link}>
              <LanguageIcon color="info" />
            </IconButton>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
};
