import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

const GridItemCard = (props) => {
  const { xs, md, lg, imageName, contentHeader, contentBody } = props;

  return (
    <Grid item xs={xs} md={md} lg={lg}>
      <Card>
        <CardMedia component="img" image={require(`../img/${imageName}`)} />
        <CardContent>
          {contentHeader && (
            <Typography gutterBottom variant="h5" component="div">
              {contentHeader}
            </Typography>
          )}
          {contentBody && (
            <Typography gutterBottom variant="body2" component="div">
              {contentBody}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default GridItemCard;
