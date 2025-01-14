import React from "react";
import StarsOutlinedIcon from "@mui/icons-material/StarsOutlined";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Divider from "@mui/material/Divider";

type Step = {
  title: string;
  description: string;
};
type Props = {
  title: string;
  steps: Step[];
  blogLink?: string;
};

function Airdroprules({ title, steps, blogLink }: Props, ref) {
  if (!steps || !(steps.length > 0)) {
    return null;
  }
  return (
    <Box sx={{ px: [0, 1, 15], my: [0, 2], py: 3 }} ref={ref}>
      <Typography align="center" variant="h2" color="primary">
        {title}
      </Typography>
      <Box sx={{ mt: 3, mx: 12 }}>
        <Grid container spacing={1} mt={4}>
          {steps.map((step, index) => (
            <Grid item key={step.title}>
              <Box sx={{ display: "flex" }}>
                <Box color="success" sx={{ mr: 1 }}>
                  <StarsOutlinedIcon color="primary" />
                </Box>
                <Typography color="bgtext.main" variant="h4">
                  {step.title}
                </Typography>
              </Box>
              <Typography color="textAdvanced.primary" textAlign="justify">
                {step.description}
              </Typography>
              {index !== steps.length - 1 ? <Divider sx={{ my: 1 }} /> : null}
            </Grid>
          ))}
        </Grid>

        <Box textAlign="center" mt={5}>
          {blogLink ? (
            <Button
              variant="outlined"
              color="secondary"
              endIcon={<OpenInNewIcon />}
              href={blogLink}
              target="_blank"
              rel="noreferrer noopener"
            >
              Read Blog Post
            </Button>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}

export default React.forwardRef(Airdroprules);
