export type TeamSetting = {
  teamId: string;
  channels: {
    intro: string;
    userStats?: string;
  };
};
export const TeamSettings = {
  // dd2030
  dd2030: {
    teamId: "T08FL58DC9K",
    channels: {
      intro: "C08HKET1YG3",
      userStats: "C08QLT17362", // 8_人数推移
    },
  },
  // チームみらい
  mirai: {
    teamId: "T08R1043FPY",
    channels: {
      intro: "C08SF0HARU6",
    },
  },
} satisfies Record<string, TeamSetting>;

export function getTeamSetting(teamId: string | undefined): TeamSetting | undefined {
  return Object.values(TeamSettings).find((setting) =>
    setting.teamId === teamId
  );
}
