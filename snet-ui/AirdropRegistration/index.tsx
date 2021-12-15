import React, { useMemo, useState } from "react";
import GradientBox from "../../snet-ui/GradientBox";
import Typography from "@mui/material/Typography";
import FlipCountdown from "../../snet-ui/FlipClock/Countdown";
import Button from "@mui/material/Button";
import Box from "@mui/system/Box";
import InfoIcon from "@mui/icons-material/Info";
import History from "../../snet-ui/History";
import { AirdropWindow, WindowStatus } from "../../utils/airdropWindows";
import Alert, { AlertColor } from "@mui/material/Alert";
import LoadingButton from "../../snet-ui/LoadingButton";
import styles from "./style.module.css";
import StatusBadge from "./StatusBadge";
import { Stack } from "@mui/material";
import { isDateBetween, isDateGreaterThan } from "utils/date";
import Staketype from "snet-ui/AirdropRegistration/Staketype";
import axios from "utils/Axios";

import { API_PATHS } from "utils/constants/ApiPaths";

type HistoryEvent = {
  label: string;
  value: string;
};

type AirdropRegistrationProps = {
  currentWindowId: number;
  totalWindows: number;
  airdropWindowTotalTokens?: number;
  endDate: Date;
  onRegister: () => void;
  onViewSchedule: () => void;
  onViewRules: () => void;
  history: HistoryEvent[];
  onClaim: () => void;
  airdropWindowStatus?: WindowStatus;
  uiAlert: { type: AlertColor; message: string };
  activeWindow?: AirdropWindow;
};

const DateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
  // timeZone: "UTC",
  timeZoneName: "short",
});

const windowStatusLabelMap = {
  [WindowStatus.UPCOMING]: "registration",
  [WindowStatus.REGISTRATION]: "registration",
  [WindowStatus.IDLE]: "claim",
  [WindowStatus.CLAIM]: "claim",
};

const windowStatusActionMap = {
  [WindowStatus.UPCOMING]: "opens",
  [WindowStatus.REGISTRATION]: "closes",
  [WindowStatus.IDLE]: "opens",
  [WindowStatus.CLAIM]: "claim",
};

const statusLabelMap = {
  [WindowStatus.CLAIM]: "Claim Open",
  [WindowStatus.REGISTRATION]: "Registration Open",
  [WindowStatus.UPCOMING]: "",
};

export default function AirdropRegistration({
  currentWindowId,
  totalWindows,
  airdropWindowTotalTokens,
  endDate,
  onRegister,
  onViewRules,
  onViewSchedule,
  history,
  onClaim,
  airdropWindowStatus,
  uiAlert,
  activeWindow,
}: AirdropRegistrationProps) {
  const [registrationLoader, setRegistrationLoader] = useState(false);
  const [claimLoader, setClaimLoader] = useState(false);

  const formattedDate = useMemo(() => DateFormatter.format(endDate), [endDate]);

  const handleRegistrationClick = async () => {
    try {
      setRegistrationLoader(true);
      await onRegister();
    } finally {
      setRegistrationLoader(false);
    }
  };

  const handleClaimClick = async () => {
    try {
      setClaimLoader(true);
      await onClaim();
      //await stake();
    } finally {
      setClaimLoader(false);
    }
  };

  // const isUpcomingClaim = isDateBetween(
  //   `${activeWindow?.airdrop_window_registration_end_period} UTC`,
  //   `${activeWindow?.airdrop_window_claim_start_period} UTC`,
  //   new Date()
  // );

  if (!activeWindow) {
    return null;
  }

  const isUpcomingRegistration = isDateGreaterThan(
    `${activeWindow?.airdrop_window_registration_start_period} UTC`,
    new Date()
  );

  const isClaimActive = isDateBetween(
    `${activeWindow?.airdrop_window_claim_start_period} UTC`,
    `${activeWindow?.airdrop_window_claim_end_period} UTC`,
    new Date()
  );

  const isRegistrationActive = isDateBetween(
    `${activeWindow?.airdrop_window_registration_start_period} UTC`,
    `${activeWindow?.airdrop_window_registration_end_period} UTC`,
    new Date()
  );

  const windowName =
    windowStatusLabelMap[activeWindow?.airdrop_window_status ?? ""];

  const windowAction =
    windowStatusActionMap[activeWindow?.airdrop_window_status ?? ""];

  return (
    <Box>
      <GradientBox
        $background="bgGradientHighlight"
        className={styles.contentWrapper}
        sx={{ px: 4, pt: 4, pb: 5, borderRadius: 2 }}
      >
        <StatusBadge
          label={
            isRegistrationActive || isClaimActive
              ? statusLabelMap[airdropWindowStatus ?? ""]
              : ""
          }
        />
        <Typography color="text.secondary" variant="h4" align="center" mb={1}>
          Airdrop {windowName} window &nbsp;
          {currentWindowId} / {totalWindows} &nbsp;
          {windowAction}:
        </Typography>
        <Typography color="text.secondary" variant="h4" align="center" mb={6}>
          {formattedDate}
        </Typography>
        <FlipCountdown endDate={endDate} />
        {airdropWindowStatus === WindowStatus.CLAIM && isClaimActive ? (
          <>
            <Box sx={{ mt: 6, mb: 4 }}>
              <Typography
                variant="subtitle1"
                align="center"
                component="p"
                color="text.secondary"
              >
                Airdrop window {currentWindowId} / {totalWindows} rewards
              </Typography>
              <Typography
                variant="h3"
                color="textAdvanced.secondary"
                align="center"
                sx={{ mt: 0.8 }}
              >
                {airdropWindowTotalTokens}
              </Typography>
            </Box>
            <Box
              sx={{
                my: 8,

                mx: 28,

                display: "flex",
                border: 0.3,

                bgcolor: "note.main",
                borderRadius: 1,
                borderColor: "note.main",
              }}
            >
              <Box sx={{ display: "flex", my: 1, py: 1, m: 1 }}>
                <InfoIcon color="primary" />
                <Typography
                  variant="body2"
                  color="textAdvanced.primary"
                  sx={{ mx: 1, fontSize: 16 }}
                >
                  You can start claiming your tokens now. It is possible to
                  claim all tokens with the last airdrop window which allow you
                  save on the gas cost fees. However we recommend you claim your
                  tokens at each window claim time.
                </Typography>
              </Box>
            </Box>
          </>
        ) : null}
        <Box sx={{ px: 2, mx: 26, borderColor: "error.main" }}>
          {uiAlert.message ? (
            <Alert severity={uiAlert.type} sx={{ mt: 2 }}>
              {uiAlert.message}
            </Alert>
          ) : null}
        </Box>
        <Box
          sx={{
            mt: 6,
            display: "flex",
            justifyContent: "center",
            flexDirection: ["column", "row"],
            gap: [0, 2],
          }}
        >
          {airdropWindowStatus === WindowStatus.CLAIM && isClaimActive ? (
            <Stack spacing={2} direction="row">
              <LoadingButton
                variant="contained"
                color="secondary"
                sx={{
                  width: 350,
                  textTransform: "capitalize",
                  fontWeight: 600,
                }}
                onClick={handleClaimClick}
                loading={claimLoader}
              >
                Claim
              </LoadingButton>

              {/* <Button
                sx={{ textTransform: "capitalize", fontWeight: 600 }}
                variant="outlined"
                color="bgHighlight"
              >
                Claim to Wallet
              </Button> */}
            </Stack>
          ) : (
            <>
              <Box
                sx={{ display: "flex", justifyContent: "center", mt: [2, 0] }}
              >
                {airdropWindowStatus === WindowStatus.REGISTRATION ? (
                  <LoadingButton
                    variant="contained"
                    color="secondary"
                    sx={{ width: 170, fontWeight: 600 }}
                    onClick={handleRegistrationClick}
                    loading={registrationLoader}
                  >
                    Register Now
                  </LoadingButton>
                ) : null}
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "center", mt: [2, 0] }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={onViewSchedule}
                  sx={{ textTransform: "capitalize", width: 170 }}
                >
                  View Schedule
                </Button>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "center", mt: [2, 0] }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={onViewRules}
                  sx={{
                    textTransform: "capitalize",
                    width: 170,
                    fontWeight: 600,
                  }}
                >
                  View Rules
                </Button>
              </Box>
            </>
          )}
        </Box>

        {history && history.length > 0 ? (
          <Box>
            <Typography
              align="center"
              color="textAdvanced.secondary"
              variant="h5"
              mt={6}
            >
              Your Airdrop History
            </Typography>
            <History events={history} />
          </Box>
        ) : null}
      </GradientBox>
    </Box>
  );
}
