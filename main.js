'use strict'
{

    const today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();    //5月（monthは0,1,2,...,11で設定されている）



    //---(1)カレンダーの作成
    //先月のカレンダーを作成（png画像も参照）
    function getCalendarHead() {
        const dates = [];
        const d = new Date(year, month, 0).getDate();    //前月の末日の数値
        const n = new Date(year, month, 1).getDay();     //[先月の最終週のカレンダー日付表示数] = [今月の初日の曜日index(Sunday-Saturday : 0-6)]

        for (let i = 0; i < n; i++) {
            //30
            //29,30
            //28,29,30
            //...
            dates.unshift({     //dates配列の先頭にobjectを格納
                date: d - i,
                isToday: false,     //isToday 本日であればbold
                isDisable: true,    //isDisabled 今月以外は薄く表示
            });
        }
        return dates;
    }


    //今月のカレンダーを作成
    function getCalendarBody() {
        const dates = [];   //date:日付 day:曜日
        //lastDate 月末の日付の数値プロパティ <= 「翌月の初日の前日」と考える
        //日付の生成　new Date(year, monthIndex [,day])
        //DateObject.getDate() => DateObjectの日付部分を数値で返す。
        const lastDate = new Date(year, month + 1, 0).getDate();

        for (let i = 1; i <= lastDate; i++) {
            dates.push({        //dates配列の末尾にobjectを追加(objectリテラルで記述)
                date: i,
                isToday: false,
                isDisable: false,
            });
        }

        //今日の日付において「isToday = true」として、太文字化
        if (year === today.getFullYear() && month === today.getMonth()) {   //年月が現在値となっているかのチェック
            dates[today.getDate() - 1].isToday = true;
        }

        return dates;
    }


    //次月のカレンダーを作成
    function getCalendarTail() {
        const dates = [];
        const lastDay = new Date(year, month + 1, 0).getDay();

        for (let i = 1; i < 7 - lastDay; i++) {     //次月の日数は、[７ - 今月の末日の曜日index]
            dates.push({       //dates配列の末尾にobjectを追加
                date: i,
                isToday: false,
                isDisable: true,
            });
        }
        return dates;
    }



    //---(2)カレンダーの描画
    //tbodyの内容のリセット
    function clearCalendar() {
        const tbody = document.querySelector('tbody');

        //while(式){処理} => 式が値を持つ限り、ループで処理を実行
        while (tbody.firstChild) {    //Node.firstChild => Nodeの子要素を返す、もしくはnull
            tbody.removeChild(tbody.firstChild);
        }
    }


    //titleの記述
    function renderTitle() {
        const title = `${year} / ${String(month + 1).padStart(2, '0')}`;  //既定の文字数にそろえる => 文字列.padStart(文字列の長さ,埋める文字)
        document.getElementById('title').textContent = title;
    }



    //カレンダーを週ごとに区切って記述
    function renderWeeks() {
        //先月今月翌月の統合
        const dates = [
            ...getCalendarHead(),   //スプレッド構文で配列を展開して格納
            ...getCalendarBody(),
            ...getCalendarTail(),
        ];

        //カレンダーを週ごとにtrで区切って描画
        const weeks = [];   //週ごとに描画するために用いる配列
        const weeksCount = dates.length / 7;

        for (let i = 0; i < weeksCount; i++) {
            weeks.push(dates.splice(0, 7))       //dates配列の最初から7つずつをweeks配列に格納
        }

        weeks.forEach(week => {                           //weeks配列の全要素に処理
            const tr = document.createElement('tr');    //tr要素の作成
            week.forEach(date => {                        //weeks配列の各要素weekの全要素に処理
                const td = document.createElement('td');    //td要素の作成

                td.textContent = date.date;             //td要素の中に　date objectのdateプロパティを記述
                if (date.isToday) {                       //date objectのisTodayプロパティがtrueなら、
                    td.classList.add('today');          //クラスを付与
                }
                if (date.isDisable) {                     //date objectのisDisableプロパティがtrueなら、
                    td.classList.add('disable');        //クラスを付与
                }

                tr.appendChild(td);                     //trの子要素にtdを追加
            })
            document.querySelector('tbody').appendChild(tr);    //tbodyの子要素にtrを追加
        })
    }


    //カレンダーの描画
    function createCalendar() {
        clearCalendar();    //tbodyの内容のリセット
        renderTitle();      //titleの記述
        renderWeeks();
    }

    createCalendar();



    //---(3)クリックイベント
    document.getElementById('prev').addEventListener('click', () => {
        month--;
        if (month < 0) {
            year--;
            month = 11;
        }
        createCalendar();
    })
    document.getElementById('next').addEventListener('click', () => {
        month++;
        if (month > 11) {
            year++;
            month = 0;
        }
        createCalendar();
    })
    document.getElementById('today').addEventListener('click', () => {
        year = today.getFullYear();
        month = today.getMonth();
        createCalendar();
    })




    //※スプレッド構文とは => 配列を配列のカタマリのまま格納するのではなく、「配列を"展開"して格納」する。
    // const foo = [1, 2];

    // let bar = [foo];         //通常表記
    // console.log(bar);        //=> [Array[1,2]]

    // let bar2 = [...foo];     //スプレッド構文
    // console.log(bar2);       //=> [1,2]

}