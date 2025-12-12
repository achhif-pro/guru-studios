// ------------------RWD運作-----------------------------------------------------
$(window).on("resize", function () {
  if (!$team_slider.hasClass("slick-initialized")) {
    return $team_slider.slick(team_slider_settings);
  }
  if (!$team_slider_2.hasClass("slick-initialized")) {
    return $team_slider.slick(team_slider_settings);
  }
  if (!$team_slider_3.hasClass("slick-initialized")) {
    return $team_slider.slick(team_slider_settings);
  }
});
