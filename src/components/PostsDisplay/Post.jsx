import * as React from 'react'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ModeCommentIcon from '@mui/icons-material/ModeComment'
import DeletePost from './DeletePost'
import UpdatePost from './UpdatePost'

import LikesManagement from './LikesManagement'
import CreateComment from '../CreateComment/CreateComment'

const ExpandMore = styled((props) => {
  const { expand, ...other } = props
  return <IconButton {...other} />
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))

export default function PostCard({ setData, data, post, alertStatus }) {
  const [expanded, setExpanded] = React.useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }
  const createdAt = new Date(post.createdAt)
  const date =
    createdAt.toLocaleDateString() + ' ' + createdAt.toLocaleTimeString()

  return (
    <Card data-id={post.id} className="post">
      <CardHeader
        avatar={
          <Avatar
            src={post.user.profile && post.user.profile.photo}
            alt={`Photo de profil de ${post.user.username}`}
            aria-label="post"
          ></Avatar>
        }
        action={
          <>
            <DeletePost
              alertStatus={alertStatus}
              setData={setData}
              data={data}
              post={post}
            />
            <UpdatePost
              alertStatus={alertStatus}
              setData={setData}
              data={data}
              post={post}
            />
          </>
        }
        title={`@${post.user.username}`}
        subheader={date}
      />
      {post.image && (
        <CardMedia
          component="img"
          image={post.image}
          alt={`image du post de ${post.user.username}`}
        />
      )}

      <CardContent>
        <Typography variant="body1" color="text.">
          {post.text}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <LikesManagement post={post} data={data} setData={setData} />
        <IconButton onClick={handleExpandClick} aria-label="add to favorites">
          <ModeCommentIcon expand={expanded} />
        </IconButton>

        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="comment and show comments"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CreateComment postId={post.id} />
      </Collapse>
    </Card>
  )
}
