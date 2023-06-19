import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

const GridItemCard = (props) => {
  const { xs, md, lg, imageName, contentHeader, contentBody, sourceName } = props;
  const sourceLinkBase =
    "https://github.com/synergylabs/Web-Dependencies/tree/main/Data/africa-analysis";
  const sourceLink = `${sourceLinkBase}`;

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
        <CardActions>
          <Button href={sourceLink}>View Source</Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default GridItemCard;
