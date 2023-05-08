"use strict";

function viewTeams(viewTeamItems) {
  $("#teamBody tr").remove();

  for (let i = 0; i < viewTeamItems.length; i++) {
    let sumElm =
      '<td class="teamTotal">合計値</td><td class="teamTotalValue">' +
      Math.round(viewTeamItems[i].total * 10) / 10 +
      "</td>";
    let memberElmArr = [];
    let pointArr = [];
    for (let j = 0; j < viewTeamItems[i].members.length; j++) {
      pointArr.push(viewTeamItems[i].members[j].point);

      let memberTdElm =
        "<td>" +
        viewTeamItems[i].members[j].name +
        "</td><td>" +
        viewTeamItems[i].members[j].point +
        "</td>";
      memberElmArr.push(memberTdElm);
    }

    // 真ん中の位置を取得
    const medianIndex = (pointArr.length / 2) | 0;

    // ソート
    const medianArr = pointArr.sort(function (x, y) {
      return x - y;
    });
    let median = 0;
    // 中央値結果
    if (medianArr.length % 2) {
      median = medianArr[medianIndex];
    } else {
      median = (medianArr[medianIndex - 1] + medianArr[medianIndex]) / 2;
    }

    let medianElm =
      '<td class="teamMedian">中央値</td><td class="teamMedianValue">' +
      Math.round(median * 10) / 10 +
      "</td>";

    // 平均値用に合計
    const sum = pointArr.reduce(function (acc, cur) {
      return acc + cur;
    });

    let average = sum / pointArr.length;
    let averageElm =
      '<td class="teamAverage">平均値</td><td class="teamAverageValue">' +
      Math.round(average * 10) / 10 +
      "</td>";

    let dataRowElms = "";
    let dataRowLength = memberElmArr.length < 3 ? 3 : memberElmArr.length;

    let memberColLoss = memberElmArr.length < 3 ? 3 - memberElmArr.length : 0;
    let evaluationColLoss =
      memberElmArr.length > 3 ? memberElmArr.length - 3 : 0;

    let memberLossFillFlg = true;
    let evaluationLossFillFlg = true;

    for (let j = 0; j < dataRowLength; j++) {
      dataRowElms += "<tr>";
      if (memberElmArr.length > j) {
        dataRowElms += memberElmArr[j];
      } else {
        if (memberLossFillFlg && memberColLoss > 0) {
          dataRowElms += '<td colspan="2" ';
          dataRowElms += "rowspan=" + memberColLoss;
          dataRowElms += "></td>";
          memberLossFillFlg = false;
        }
      }
      if (j == 0) {
        // 合計値
        dataRowElms += sumElm;
      } else if (j == 1) {
        // 中央値
        dataRowElms += medianElm;
      } else if (j == 2) {
        // 平均値
        dataRowElms += averageElm;
      } else {
        if (evaluationLossFillFlg && evaluationColLoss > 0) {
          dataRowElms += '<td colspan="2" ';
          dataRowElms += "rowspan=" + evaluationColLoss;
          dataRowElms += "></td>";
          evaluationLossFillFlg = false;
        }
      }
      dataRowElms += "</tr>";
    }

    let teamElm =
      '<tr class="teamHeader"><td colspan="4">チーム' +
      (i + 1) +
      "</td></tr>" +
      dataRowElms;
    $("#teamBody").append(teamElm);
  }
}
