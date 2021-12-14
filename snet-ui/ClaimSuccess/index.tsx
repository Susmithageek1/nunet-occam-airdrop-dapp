import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import GradientBox from "../../snet-ui/GradientBox";
import { Box } from "@mui/system";
// import Image from "next/image";
// import success from "public/images/success.png";

import InfoIcon from "@mui/icons-material/Info";
import { Stack } from "@mui/material";
import Button from "@mui/material/Button";

type RegistrationSuccessProps = {
  onViewSchedule: () => void;
  onViewRules: () => void;
  onViewNotification: () => void;
  currentWindowId: number;
  totalWindows: number;
};

export default function ClaimSuccess({
  onViewSchedule,
  onViewRules,
  onViewNotification,
  currentWindowId,
  totalWindows,
}: RegistrationSuccessProps) {
  return (
    <Box>
      <GradientBox sx={{ py: 2, pb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", m: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
            <img
              src="/images/success.png"
              alt="SingularityNET"
              height="137px"
              width="137px"
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", pb: 3 }}>
          <Box>
            <Typography align="center" variant="h4" color="secondary.main">
              Congratulations
            </Typography>
            <Box>
              <Typography
                align="center"
                fontWeight="bold"
                variant="h5"
                color="text.secondary"
              >
                Successfully Claimed for Airdrop Window {currentWindowId}/
                {totalWindows}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                my: 4,
                height: "108px",
                width: "620px",
                bgcolor: "note.main",
              }}
            >
              <Box sx={{ display: "flex", my: 1, py: 1, m: 1 }}>
                <InfoIcon color="primary" />
                <Typography variant="body1" color="textAdvanced.primary">
                  To be eligible for the next airdrop, you need to register when
                  window opens. The next window opens from 01 November 2021.
                </Typography>
              </Box>
            </Box>
            <Box sx={{ m: 8, my: 2, py: 2 }}>
              <Stack spacing={3} direction="row">
                <Button variant="outlined" onClick={onViewNotification}>
                  <Typography color="text.secondary" fontSize="14px">
                    Get Notifications
                  </Typography>
                </Button>

                <Button variant="outlined" onClick={onViewSchedule}>
                  <Typography color="text.secondary" fontSize="14px">
                    View Schedule
                  </Typography>
                </Button>
                <Button variant="outlined" onClick={onViewRules}>
                  <Typography color="text.secondary" fontSize="14px">
                    View Rules
                  </Typography>
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>
      </GradientBox>
    </Box>
  );
}
