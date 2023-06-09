import Link from "@mui/material/Link";

export default function ItemLink(props) {
  const { link, name } = props;

  return (
    <Link href={link} target="_blank" rel="noreferrer" color="info">
      {name}
    </Link>
  );
}
