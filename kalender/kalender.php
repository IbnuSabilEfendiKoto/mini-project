<?php
//Dapatkan bulan dan tahun saat ini
$currentMonth = date("n");
$currentYear = date("Y");

//Periksa apakah pengguna mengklik tombol sebelumnya atau berikutnya
if (isset($_GET['month']) && isset($_GET['year'])) {
    $currentMonth = $_GET['month'];
    $currentYear = $_GET['year'];
}

//Hitung bulan dan tahun sebelumnya dan berikutnya
$prevMonth = $currentMonth - 1;
$prevYear = $currentYear;
if ($prevMonth == 0) {
    $prevMonth = 12;
    $prevYear--;
}

$nextMonth = $currentMonth + 1;
$nextYear = $currentYear;
if ($nextMonth == 13) {
    $nextMonth = 1;
    $nextYear++;
}

//Hitung jumlah hari di bulan berjalan
$daysInMonth = cal_days_in_month(CAL_GREGORIAN, $currentMonth, $currentYear);

//Hitung hari dalam seminggu untuk hari pertama bulan itu
$firstDayOfWeek = date("w", strtotime("$currentYear-$currentMonth-1"));

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kalender 1</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: grey;
        }

        .calendar {
            background-color: white;
            padding: 20px;
        }

        .calendar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .calendar-header a {
            text-decoration: none;
        }

        .calendar-table {
            width: 100%;
            border-collapse: collapse;
        }

        .calendar-table th {
            text-align: center;
            padding: 10px;
        }

        .calendar-table td {
            text-align: center;
            padding: 10px;
            border: 1px solid #ccc;
        }
    </style>
</head>

<body>
    <div class="calendar">
        <div class="calendar-header">
            <a href="?month=<?php echo $prevMonth; ?>&year=<?php echo $prevYear; ?>">&lt;</a>
            <h1><?php echo date("F Y", strtotime("$currentYear-$currentMonth-1")); ?></h1>
            <a href="?month=<?php echo $nextMonth; ?>&year=<?php echo $nextYear; ?>">&gt;</a>
        </div>
        <table class="calendar-table">
            <tr>
                <th>Sun</th>
                <th>Mon</th>
                <th>Tue</th>
                <th>Wed</th>
                <th>Thu</th>
                <th>Fri</th>
                <th>Sat</th>
            </tr>
            <tr>
                <?php
                $day = 1;

                //Sel kosong untuk hari-hari sebelum hari pertama bulan itu
                for ($i = 0; $i < $firstDayOfWeek; $i++) {
                    echo "<td></td>";
                }

                //Loop melalui setiap hari dalam sebulan
                while ($day <= $daysInMonth) {
                    echo "<td";
                    if ($day == date("j") && $currentMonth == date("n") && $currentYear == date("Y")) {
                        echo " class='today'";
                    }
                    echo ">$day</td>";

                    //Mulai baris baru di awal minggu
                    if (($firstDayOfWeek + $day) % 7 == 0) {
                        echo "</tr><tr>";
                    }

                    $day++;
                }

                //Sel kosong untuk hari-hari setelah hari terakhir bulan itu
                while (($firstDayOfWeek + $daysInMonth) % 7 != 0) {
                    echo "<td></td>";
                    $daysInMonth++;
                }
                ?>
            </tr>
        </table>
    </div>
</body>

</html>