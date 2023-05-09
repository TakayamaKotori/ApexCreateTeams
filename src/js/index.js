"use strict";

$(function () {
  let data = {
    // メンバーの情報
    members: [{ name: "", point: 5, joining: true, handicap: 0 }],
    // メンバー数
    memberCount: 1,
    // ランダム強度
    randomStrength: 5,

    // 設定値
    teamNum: 4,
    minMember: 1,
    maxMember: 3,

    // プリセット
    gungamePreset: { teamNum: 4, minMember: 1, maxMember: 3 },
    tdmPreset: { teamNum: 2, minMember: 1, maxMember: 6 },
    controlPreset: { teamNum: 2, minMember: 1, maxMember: 9 },
    // メンバー操作欄表示
    memberControlVisible: true,

    // 更新履歴ファイル
    url: "changelog.json",

    // インポート表示
    importAreaVisible: false,
    // 更新履歴表示
    changeLogAreaVisible: false,
    // ヘルプテキスト表示
    helpMessageAreaVisible: false,
  };

  // ドラッグによるソートを有効化
  $("#MemberBody").sortable();

  // ドラッグによるソート時のイベント
  $("#MemberBody").on("sortstop", memberTableNumbering);

  // ヘルプテキスト表示切替ボタン押下
  $(document).on("click", "#helpMessageBtn", function () {
    if (data.helpMessageAreaVisible) {
      data.helpMessageAreaVisible = false;
      $("#helpMessageArea").css("display", "none");
    } else {
      data.helpMessageAreaVisible = true;
      $("#helpMessageArea").css("display", "block");
    }
  });

  // 受け渡し用エリア表示切替ボタン押下
  $(document).on("click", "#exportView", function () {
    if (data.importAreaVisible) {
      data.importAreaVisible = false;
      $("#exportArea").css("display", "none");
    } else {
      data.importAreaVisible = true;
      $("#exportArea").css("display", "block");
    }
  });

  // メンバー操作欄表示切替ボタン押下
  $(document).on("click", "#mem-visible", function () {
    if (data.memberControlVisible) {
      data.memberControlVisible = false;
      $("#member").css("display", "none");
      $("#mem-control-panel").css("display", "none");
    } else {
      data.memberControlVisible = true;
      $("#member").css("display", "block");
      $("#mem-control-panel").css("display", "block");
    }
  });

  // 更新履歴エリア表示切替ボタン押下
  $(document).on("click", "#changeLogBtn", function () {
    if (data.changeLogAreaVisible) {
      data.changeLogAreaVisible = false;
      $("#changeLogArea").css("display", "none");
    } else {
      data.changeLogAreaVisible = true;
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
      data.members = jsonObj["members"];
      data.memberCount = refreshTable(data);
    }
  });

  // 追加ボタン押下
  $(document).on("click", "#mem-add", function () {
    addRow(data);
    data.members.push({ name: "", point: 5, joining: true });
    nowMember(data);
  });

  // 参加状態全切り替えボタン押下
  $(document).on("click", "#check-all", function () {
    const result = data.members.filter((member) => !member.joining);
    if (result.length > 0) {
      for (let i = 0; i < data.members.length; i++) {
        data.members[i].joining = true;
      }
    } else {
      for (let i = 0; i < data.members.length; i++) {
        data.members[i].joining = false;
      }
    }
    data.memberCount = refreshTable(data);
  });

  // ポイントでソートボタン押下
  $(document).on("click", "#point-sort", function () {
    pointSort(data);
    refreshTable(data);
  });

  // ハンデクリアボタン押下
  $(document).on("click", "#clear-handi", function () {
    for (let i = 0; i < data.members.length; i++) {
      data.members[i].handicap = 0;
    }
    data.memberCount = refreshTable(data);
  });

  // ガンゲームボタン押下
  $(document).on("click", "#gungame-preset", function () {
    data.teamNum = data.gungamePreset.teamNum;
    data.minMember = data.gungamePreset.minMember;
    data.maxMember = data.gungamePreset.maxMember;
    refresteamSetting();
  });

  // チームデスマッチボタン押下
  $(document).on("click", "#tdm-preset", function () {
    data.teamNum = data.tdmPreset.teamNum;
    data.minMember = data.tdmPreset.minMember;
    data.maxMember = data.tdmPreset.maxMember;
    refresteamSetting();
  });

  // コントロールボタン押下
  $(document).on("click", "#control-preset", function () {
    data.teamNum = data.controlPreset.teamNum;
    data.minMember = data.controlPreset.minMember;
    data.maxMember = data.controlPreset.maxMember;
    refresteamSetting();
  });

  // プリセット適用
  function refresteamSetting() {
    $("#teamNum").val(data.teamNum);
    $("#minMember").val(data.minMember);
    $("#maxMember").val(data.maxMember);

    validateSetting(data);
  }

  // 実行ボタン押下
  $(document).on("click", "#create-teams", function () {
    // プレイヤーをチームに分ける
    const players = data.members.filter((member) => member.joining);
    const result = createTeams(
      data,
      players,
      data.teamNum,
      data.minMember,
      data.maxMember
    );

    viewTeams(result);
  });

  // ランダム強度変更イベント
  $(document).on("change", "#random-point", function () {
    randomChange(this, data);
  });
  $(document).on("keyup", "#random-point", function () {
    randomChange(this, data);
  });

  // チーム数変更イベント
  $(document).on("change", "#teamNum", function () {
    teamNumChange(this, data);
  });
  $(document).on("keyup", "#teamNum", function () {
    teamNumChange(this, data);
  });

  // 最小人数変更イベント
  $(document).on("change", "#minMember", function () {
    minMemberChange(this, data);
  });
  $(document).on("keyup", "#minMember", function () {
    minMemberChange(this, data);
  });

  // 最大人数変更イベント
  $(document).on("change", "#maxMember", function () {
    maxMemberChange(this, data);
  });
  $(document).on("keyup", "#maxMember", function () {
    maxMemberChange(this, data);
  });

  // 削除ボタン押下
  $(document).on("click", ".delete-mem", function () {
    let elmId = $(this).attr("id");
    let idSplit = elmId.split("_");
    let deleteId = idSplit[1];

    if (data.memberCount != 1) {
      $("#member-no_" + deleteId).remove();
    }
    memberTableNumbering(data);
    nowMember(data);
  });

  // 名前変更イベント
  $(document).on("keyup", ".input-name", function () {
    nowMember(data);
  });

  // ポイント変更イベント
  $(document).on("change", ".input-point", function () {
    pointChange(this, data);
  });
  $(document).on("keyup", ".input-point", function () {
    pointChange(this, data);
  });

  // ハンデ値変更イベント
  $(document).on("change", ".input-handi", function () {
    nowMember(data);
  });
  $(document).on("keyup", ".input-handi", function () {
    nowMember(data);
  });

  // 参加フラグ変更イベント
  $(document).on("change", 'input[name="joining"]', function () {
    nowMember(data);
  });

  // 初期動作。ローカルストレージが存在したら前回データの読み込み実行
  if (localStorage.getItem("Member")) {
    loadMember(data);
  }

  // 起動時の処理
  window.addEventListener("load", () => {
    $.getJSON(data.url)
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
