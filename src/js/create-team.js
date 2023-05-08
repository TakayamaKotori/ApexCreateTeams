"use strict";

$(function () {
  // メンバー数
  let memberCount = 1;
  // メンバーの情報
  let members = [{ name: "", point: 5, joining: true, handicap: 0 }];

  // ランダム強度
  let randomStrength = 5;

  // 設定値
  let teamNum = 4;
  let minMember = 1;
  let maxMember = 3;

  const gungamePreset = { teamNum: 4, minMember: 1, maxMember: 3 };
  const tdmPreset = { teamNum: 2, minMember: 1, maxMember: 6 };
  const controlPreset = { teamNum: 2, minMember: 1, maxMember: 9 };

  // インポート表示
  let importAreaVisible = false;

  // 更新履歴表示
  let changeLogAreaVisible = false;

  // ヘルプテキスト表示
  let helpMessageAreaVisible = false;

  // メンバー操作欄表示
  let memberControlVisible = true;

  // ローカルストレージへ保存
  function saveMember() {
    let memberJson = {};
    memberJson["memberCount"] = memberCount;
    memberJson["members"] = members;
    localStorage.setItem("Member", JSON.stringify(memberJson));

    $("#exportImport").val(JSON.stringify(memberJson, null, "  "));
  }

  // ローカルストレージから読み込み
  function loadMember() {
    let x = JSON.parse(localStorage.getItem("Member"));
    if (x["memberCount"] !== undefined && x["members"] !== undefined) {
      members = x["members"];
      refreshTable();
    }
  }

  // ポイントによるソート関数
  function pointSort() {
    let result = members.sort(function (a, b) {
      return a.point < b.point ? 1 : -1;
    });

    members = result;
  }

  // 変数からテーブルへデータを適用
  function refreshTable() {
    for (let i = 0; i < members.length; i++) {
      let checkElm = $("#mem-name_" + (i + 1));
      if (checkElm.length == 0) {
        addRow();
      }

      $("#mem-name_" + (i + 1)).val(members[i].name);
      $("#mem-point_" + (i + 1)).val(members[i].point);
      $("#mem-handi_" + (i + 1)).val(members[i].handicap);
      $("#joining_" + (i + 1) + ' input[name="joining"]').prop(
        "checked",
        members[i].joining
      );
    }
    nowMember();
  }

  // ドラッグによるソートを有効化
  $("#MemberBody").sortable();

  // ドラッグによるソート時のイベント
  $("#MemberBody").on("sortstop", memberTableNumbering);

  // テーブルのID振り直し
  function memberTableNumbering() {
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
    nowMember();
  }

  // ヘルプテキスト表示切替ボタン押下
  $(document).on("click", "#helpMessageBtn", function () {
    if (helpMessageAreaVisible) {
      helpMessageAreaVisible = false;
      $("#helpMessageArea").css("display", "none");
    } else {
      helpMessageAreaVisible = true;
      $("#helpMessageArea").css("display", "block");
    }
  });

  // 受け渡し用エリア表示切替ボタン押下
  $(document).on("click", "#exportView", function () {
    if (importAreaVisible) {
      importAreaVisible = false;
      $("#exportArea").css("display", "none");
    } else {
      importAreaVisible = true;
      $("#exportArea").css("display", "block");
    }
  });

  // メンバー操作欄表示切替ボタン押下
  $(document).on("click", "#mem-visible", function () {
    if (memberControlVisible) {
      memberControlVisible = false;
      $("#member").css("display", "none");
      $("#mem-control-panel").css("display", "none");
    } else {
      memberControlVisible = true;
      $("#member").css("display", "block");
      $("#mem-control-panel").css("display", "block");
    }
  });

  // 更新履歴エリア表示切替ボタン押下
  $(document).on("click", "#changeLogBtn", function () {
    if (changeLogAreaVisible) {
      changeLogAreaVisible = false;
      $("#changeLogArea").css("display", "none");
    } else {
      changeLogAreaVisible = true;
      $("#changeLogArea").css("display", "block");
    }
  });

  // 貼り付けたらボタンで読み込みボタン押下
  $(document).on("click", "#loadJson", function () {
    let importElm = $("#exportImport");
    let loadJsonStr = importElm.val();
    const jsonObj = JSON.parse(loadJsonStr);
    if (
      jsonObj["memberCount"] !== undefined &&
      jsonObj["members"] !== undefined
    ) {
      members = jsonObj["members"];
      refreshTable();
    }
  });

  // 追加ボタン押下
  $(document).on("click", "#mem-add", function () {
    addRow();
    members.push({ name: "", point: 5, joining: true });
    nowMember();
  });

  // 参加状態全切り替えボタン押下
  $(document).on("click", "#check-all", function () {
    const result = members.filter((member) => !member.joining);
    if (result.length > 0) {
      for (let i = 0; i < members.length; i++) {
        members[i].joining = true;
      }
    } else {
      for (let i = 0; i < members.length; i++) {
        members[i].joining = false;
      }
    }
    refreshTable();
  });

  // ポイントでソートボタン押下
  $(document).on("click", "#point-sort", function () {
    pointSort();
    refreshTable();
  });

  // ハンデクリアボタン押下
  $(document).on("click", "#clear-handi", function () {
    for (let i = 0; i < members.length; i++) {
      members[i].handicap = 0;
    }
    refreshTable();
  });

  // ガンゲームボタン押下
  $(document).on("click", "#gungame-preset", function () {
    teamNum = gungamePreset.teamNum;
    minMember = gungamePreset.minMember;
    maxMember = gungamePreset.maxMember;
    refresteamSetting();
  });

  // チームデスマッチボタン押下
  $(document).on("click", "#tdm-preset", function () {
    teamNum = tdmPreset.teamNum;
    minMember = tdmPreset.minMember;
    maxMember = tdmPreset.maxMember;
    refresteamSetting();
  });

  // コントロールボタン押下
  $(document).on("click", "#control-preset", function () {
    teamNum = controlPreset.teamNum;
    minMember = controlPreset.minMember;
    maxMember = controlPreset.maxMember;
    refresteamSetting();
  });

  // プリセット適用
  function refresteamSetting() {
    $("#teamNum").val(teamNum);
    $("#minMember").val(minMember);
    $("#maxMember").val(maxMember);

    validateSetting();
  }

  // 実行ボタン押下
  $(document).on("click", "#create-teams", function () {
    // プレイヤーをチームに分ける
    const players = members.filter((member) => member.joining);
    const result = createTeams(players, teamNum, minMember, maxMember);

    viewTeams(result);
  });

  // ランダム強度変更イベント
  $(document).on("change", "#random-point", randomChange);
  $(document).on("keyup", "#random-point", randomChange);

  // ランダム強度変更時の処理
  function randomChange() {
    let val = $(this).val();

    randomStrength = Number(val);
  }

  // チーム数変更イベント
  $(document).on("change", "#teamNum", teamNumChange);
  $(document).on("keyup", "#teamNum", teamNumChange);

  // チーム数変更時の処理
  function teamNumChange() {
    let val = $(this).val();

    teamNum = Number(val);
    validateSetting();
  }

  // 最小人数変更イベント
  $(document).on("change", "#minMember", minMemberChange);
  $(document).on("keyup", "#minMember", minMemberChange);

  // 最小人数変更時の処理
  function minMemberChange() {
    let val = $(this).val();

    minMember = Number(val);
    validateSetting();
  }

  // 最大人数変更イベント
  $(document).on("change", "#maxMember", maxMemberChange);
  $(document).on("keyup", "#maxMember", maxMemberChange);

  // 最大人数変更時の処理
  function maxMemberChange() {
    let val = $(this).val();

    maxMember = Number(val);
    validateSetting();
  }

  // 行追加
  function addRow() {
    memberCount += 1;
    let memRowElm =
      '<tr class="memberRow" id="member-no_' +
      memberCount +
      '">' +
      '<th class="no-cell" name="mem-num">' +
      memberCount +
      "</th>" +
      '<td class="name-cell"><input class="input-name" id="mem-name_' +
      memberCount +
      '" autocomplete="off"></td>' +
      '<td class="point-cell"><input class="input-point" id="mem-point_' +
      memberCount +
      '" type="number" autocomplete="off" ' +
      'min="0" max="10" step="0.1" value="5"></td>' +
      '<td class="handi-cell"><input  class="input-handi" id="mem-handi_' +
      memberCount +
      '" autocomplete="off" type="number" step="0.1" value="0" /></td>' +
      '<td class="joining-cell joining-mem" id="joining_' +
      memberCount +
      '"><input type="checkbox" name="joining" value="join_' +
      memberCount +
      '" /></td>' +
      '<td class="delete-cell delete-mem" id="delete_' +
      memberCount +
      '"><span class="ui-icon ui-icon-close"></span></td>' +
      "</tr>";
    $("#MemberBody").append(memRowElm);
  }

  // 削除ボタン押下
  $(document).on("click", ".delete-mem", function () {
    let elmId = $(this).attr("id");
    let idSplit = elmId.split("_");
    let deleteId = idSplit[1];

    if (memberCount != 1) {
      $("#member-no_" + deleteId).remove();
    }
    memberTableNumbering();
    nowMember();
  });

  // 名前変更イベント
  $(document).on("keyup", ".input-name", function () {
    nowMember();
  });

  // ポイント変更イベント
  $(document).on("change", ".input-point", pointChange);
  $(document).on("keyup", ".input-point", pointChange);

  // ポイント変更時の処理
  function pointChange() {
    let point = $(this).val();
    if (point > 10) {
      point = 10;
      $(this).val(point);
    } else if (point < 0) {
      point = 0;
      $(this).val(point);
    }
    nowMember();
  }

  // ハンデ値変更イベント
  $(document).on("change", ".input-handi", nowMember);
  $(document).on("keyup", ".input-handi", nowMember);

  // 参加フラグ変更イベント
  $(document).on("change", 'input[name="joining"]', nowMember);

  function validateSetting() {
    $("#validateOk").css("display", "block");
    $("#validateNgMamy").css("display", "none");
    $("#validateNgLoss").css("display", "none");
    $("#validateConflict").css("display", "none");
    $("#create-teams").prop("disabled", false);
    let joinMaxPlayersCount = maxMember * teamNum;
    let joinMinPlayersCount = minMember * teamNum;

    // 参加人数取得
    const joinMember = members.filter((member) => member.joining);
    if (minMember > maxMember) {
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
  function nowMember() {
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

    memberCount = rowCount;
    members = memberList;

    // 参加人数取得
    const joinMember = members.filter((member) => member.joining);
    $("#joinCount").html("参加人数 " + joinMember.length);

    validateSetting();
    saveMember();
  }

  // ランダムな値を取得
  function getRandom(min, max) {
    const a = Math.floor(Math.random() * (max + 1 - min)) + min;
    return a / 10;
  }

  function createTeams(players, numTeams, minMembers, maxMembers) {
    // ランダム値を付与
    for (let i = 0; i < players.length; i++) {
      players[i].random = getRandom(0, randomStrength * 10);
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
          Math.floor(Math.random() * (maxMembers + 1 - minMembers)) +
          minMembers;
        if (playerCount >= a) {
          teamSizes.push(a);
          playerCount -= a;
        } else if (playerCount >= minMember) {
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

  // 初期動作。ローカルストレージが存在したら前回データの読み込み実行
  if (localStorage.getItem("Member")) {
    loadMember();
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

  const url = "changelog.json";
  // 起動時の処理
  window.addEventListener("load", () => {
    $.getJSON(url)
      .done(function (json) {
        // 成功
        loadChangeLog(json);
      })
      .fail(function (e) {
        // 失敗
        console.error(e);
      })
      .always(function () {});
  });
});
