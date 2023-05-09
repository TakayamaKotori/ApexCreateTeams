"use strict";

// ローカルストレージへ保存
function saveMember(data) {
  let memberJson = {};
  memberJson["memberCount"] = data.memberCount;
  memberJson["members"] = data.members;
  localStorage.setItem("Member", JSON.stringify(memberJson));

  $("#exportImport").val(JSON.stringify(memberJson, null, "  "));
}

// ローカルストレージから読み込み
function loadMember(data) {
  let x = JSON.parse(localStorage.getItem("Member"));
  if (x["memberCount"] !== undefined && x["members"] !== undefined) {
    data.members = x["members"];
    refreshTable(data);
  }
}

// 変数からテーブルへデータを適用
function refreshTable(data) {
  for (let i = 0; i < data.members.length; i++) {
    let checkElm = $("#mem-name_" + (i + 1));
    if (checkElm.length == 0) {
      addRow(data);
    }

    $("#mem-name_" + (i + 1)).val(data.members[i].name);
    $("#mem-point_" + (i + 1)).val(data.members[i].point);
    $("#mem-handi_" + (i + 1)).val(data.members[i].handicap);
    $("#joining_" + (i + 1) + ' input[name="joining"]').prop(
      "checked",
      data.members[i].joining
    );
  }
  nowMember(data);
}

// テーブルのID振り直し
function memberTableNumbering(data) {
  // 行ID
  $("#MemberBody")
    .find("tr")
    .each(function (idx) {
      $(this).attr({
        id: "member-no_" + (idx + 1),
      });
    });
  // No
  $("#MemberBody")
    .find('[name="mem-num"]')
    .each(function (idx) {
      $(this).html(idx + 1);
    });

  // 名前ID
  $("#MemberBody")
    .find(".input-name")
    .each(function (idx) {
      $(this).attr({
        id: "mem-name_" + (idx + 1),
      });
    });

  // ポイントID
  $("#MemberBody")
    .find(".input-point")
    .each(function (idx) {
      $(this).attr({
        id: "mem-point_" + (idx + 1),
      });
    });

  // 参加値
  $("#MemberBody")
    .find(".joining-mem")
    .each(function (idx) {
      $(this).attr({
        id: "joining_" + (idx + 1),
      });
    });
  $("#MemberBody")
    .find(".joining-mem input")
    .each(function (idx) {
      $(this).attr({
        value: "join_" + (idx + 1),
      });
    });

  // 削除ボタンID
  $("#MemberBody")
    .find(".delete-mem")
    .each(function (idx) {
      $(this).attr({
        id: "delete_" + (idx + 1),
      });
    });
  nowMember(data);
}

// ランダム強度変更時の処理
function randomChange(ent, data) {
  let val = $(ent).val();

  data.randomStrength = Number(val);
}

// チーム数変更時の処理
function teamNumChange(ent, data) {
  let val = $(ent).val();

  data.teamNum = Number(val);
  validateSetting(data);
}

// 最小人数変更時の処理
function minMemberChange(ent, data) {
  let val = $(ent).val();

  data.minMember = Number(val);
  validateSetting(data);
}

// 最大人数変更時の処理
function maxMemberChange(ent, data) {
  let val = $(ent).val();

  data.maxMember = Number(val);
  validateSetting(data);
}

// 行追加
function addRow(data) {
  data.memberCount += 1;
  let memRowElm =
    '<tr class="memberRow" id="member-no_' +
    data.memberCount +
    '">' +
    '<th class="no-cell" name="mem-num">' +
    data.memberCount +
    "</th>" +
    '<td class="name-cell"><input class="input-name" id="mem-name_' +
    data.memberCount +
    '" autocomplete="off"></td>' +
    '<td class="point-cell"><input class="input-point" id="mem-point_' +
    data.memberCount +
    '" type="number" autocomplete="off" ' +
    'min="0" max="10" step="0.1" value="5"></td>' +
    '<td class="handi-cell"><input  class="input-handi" id="mem-handi_' +
    data.memberCount +
    '" autocomplete="off" type="number" step="0.1" value="0" /></td>' +
    '<td class="joining-cell joining-mem" id="joining_' +
    data.memberCount +
    '"><input type="checkbox" name="joining" value="join_' +
    data.memberCount +
    '" /></td>' +
    '<td class="delete-cell delete-mem" id="delete_' +
    data.memberCount +
    '"><span class="ui-icon ui-icon-close"></span></td>' +
    "</tr>";
  $("#MemberBody").append(memRowElm);
}

// ポイント変更時の処理
function pointChange(ent, data) {
  let point = $(ent).val();
  if (point > 10) {
    point = 10;
    $(ent).val(point);
  } else if (point < 0) {
    point = 0;
    $(ent).val(point);
  }
  nowMember(data);
}

function validateSetting(data) {
  $("#validateOk").css("display", "block");
  $("#validateNgMamy").css("display", "none");
  $("#validateNgLoss").css("display", "none");
  $("#validateConflict").css("display", "none");
  $("#create-teams").prop("disabled", false);
  let joinMaxPlayersCount = data.maxMember * data.teamNum;
  let joinMinPlayersCount = data.minMember * data.teamNum;

  // 参加人数取得
  const joinMember = data.members.filter((member) => member.joining);
  if (data.minMember > data.maxMember) {
    // 実行不可
    $("#validateOk").css("display", "none");
    $("#validateConflict").css("display", "block");
    $("#create-teams").prop("disabled", true);
  } else if (joinMaxPlayersCount < joinMember.length) {
    // 何人か余ります
    $("#validateOk").css("display", "none");
    $("#validateNgMamy").css("display", "block");
  } else if (joinMinPlayersCount > joinMember.length) {
    // 何人か足りません
    $("#validateOk").css("display", "none");
    $("#validateNgLoss").css("display", "block");
  }
}

// 現在のテーブルのデータを変数へ保存
function nowMember(data) {
  let rowCount = 0;
  let memberList = [];

  // ひとつ前のポイント
  let lastPoint = 10;
  $(".memberRow").each(function (index, element) {
    rowCount += 1;

    // 名前取得
    let targetNameElm = $("#mem-name_" + rowCount);
    let targetName = targetNameElm.val();
    if (targetName == "") {
      targetNameElm.addClass("error");
    } else {
      targetNameElm.removeClass("error");
    }

    // ポイント取得
    let targetPointElm = $("#mem-point_" + rowCount);
    let targetPoint = Number(targetPointElm.val());
    if (lastPoint >= targetPoint) {
      targetPointElm.removeClass("error");
    } else {
      targetPointElm.addClass("error");
    }
    lastPoint = targetPoint;

    // ハンデ値取得
    let targetHandiElm = $("#mem-handi_" + rowCount);
    let handiPoint = Number(targetHandiElm.val());

    // 参加フラグ取得

    let joiningElm = $("#joining_" + rowCount + ' input[name="joining"]');

    let joiningFlg = false;
    if (joiningElm.prop("checked")) {
      joiningFlg = true;
    } else {
      joiningFlg = false;
    }

    let memberInfo = {
      name: targetName,
      point: targetPoint,
      joining: joiningFlg,
      handicap: handiPoint,
    };
    memberList.push(memberInfo);
  });

  data.memberCount = rowCount;
  data.members = memberList;

  // 参加人数取得
  const joinMember = data.members.filter((member) => member.joining);
  $("#joinCount").html("参加人数 " + joinMember.length);

  validateSetting(data);
  saveMember(data);
}

// ランダムな値を取得
function getRandom(min, max) {
  const a = Math.floor(Math.random() * (max + 1 - min)) + min;
  return a / 10;
}

function createTeams(data, players, numTeams, minMembers, maxMembers) {
  // ランダム値を付与
  for (let i = 0; i < players.length; i++) {
    players[i].random = getRandom(0, data.randomStrength * 10);
  }

  // プレイヤーのスキルレベルとハンデ、ランダム値を含んで降順にソート
  const sortedPlayers = players.sort(
    (a, b) =>
      b.point + b.handicap + b.random - (a.point + a.handicap + a.random)
  );

  let teamSizes = [];
  let joinMaxPlayersCount = maxMembers * numTeams;
  let joinMinPlayersCount = minMembers * numTeams;
  let playerCount;
  let lossPlayers = false;
  if (joinMaxPlayersCount < players.length) {
    playerCount = joinMaxPlayersCount;
  } else if (joinMinPlayersCount > players.length) {
    playerCount = players.length;
    lossPlayers = true;
  } else {
    playerCount = players.length;
  }
  while (playerCount != 0) {
    if (joinMaxPlayersCount < players.length) {
      playerCount = joinMaxPlayersCount;
    } else if (joinMinPlayersCount > players.length) {
      playerCount = players.length;
    } else {
      playerCount = players.length;
    }
    teamSizes = [];
    for (let i = 0; i < numTeams; i++) {
      if (playerCount == 0) {
        continue;
      }
      let a =
        Math.floor(Math.random() * (maxMembers + 1 - minMembers)) + minMembers;
      if (playerCount >= a) {
        teamSizes.push(a);
        playerCount -= a;
      } else if (playerCount >= minMembers) {
        teamSizes.push(playerCount);
        playerCount -= playerCount;
      } else if (playerCount < a && lossPlayers) {
        teamSizes.push(playerCount);
        playerCount -= playerCount;
      } else {
        continue;
      }
    }
    if (teamSizes.length < numTeams && !lossPlayers) {
      playerCount = -1;
    }
  }
  teamSizes.sort((a, b) => a - b);

  // チームごとのメンバー格納配列
  const teams = [];
  let restMembers = [];
  // スキルの高いリーダーとなるプレイヤーをチーム数分選出
  for (let i = 0; i < sortedPlayers.length; i++) {
    if (i < teamSizes.length) {
      // リーダーメンバー格納
      let team = { total: sortedPlayers[i].point, members: [] };
      team.members.push(sortedPlayers[i]);
      teams.push(team);
    } else {
      restMembers.push(sortedPlayers[i]);
    }
  }

  // 各チームへ残りのメンバーを振り分け
  // 各チームのスキル値の合計が近いようにする。
  // スキル値の小さいほうから強い人に振り分け

  // 残りのメンバーを昇順でソート
  restMembers = restMembers.sort(
    (a, b) =>
      a.point + a.handicap + a.random - (b.point + b.handicap + b.random)
  );

  for (let i = 0; i < restMembers.length; i++) {
    for (let j = 0; j < teams.length; j++) {
      if (teamSizes[j] > teams[j].members.length) {
        teams[j].total += restMembers[i].point;
        teams[j].members.push(restMembers[i]);
        break;
      }
    }
  }
  return teams;
}

function loadChangeLog(changelogJson) {
  const changeLog = changelogJson.changeLog.sort((a, b) =>
    a.date < b.date ? 1 : -1
  );

  let changeLogText = "更新履歴";
  for (let i = 0; i < changeLog.length; i++) {
    let changeRow = "\n\n-" + changeLog[i].date + "\n" + changeLog[i].message;
    changeLogText += changeRow;
  }
  $("#changeLog").val(changeLogText);
}

// ポイントによるソート関数
function pointSort(data) {
  let result = data.members.sort(function (a, b) {
    return a.point < b.point ? 1 : -1;
  });

  data.members = result;
}
