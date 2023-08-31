<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $targetDir = "uploads/";
    $imageFile = $targetDir . basename($_FILES["image"]["name"]);
    $logoFile = $_FILES["logo"]["tmp_name"];
    $outputFile = $targetDir . "output.jpg";

    // Upload the image
    if (move_uploaded_file($_FILES["image"]["tmp_name"], $imageFile)) {
        // Load the image
        $image = imagecreatefromjpeg($imageFile);
        $logo = imagecreatefrompng($logoFile);

        // Get the dimensions
        $imageWidth = imagesx($image);
        $imageHeight = imagesy($image);
        $logoWidth = imagesx($logo);
        $logoHeight = imagesy($logo);

        // Position of the watermark
        $watermarkX = $imageWidth - $logoWidth - 10;
        $watermarkY = 10;

        // Merge the logo onto the image
        imagecopy($image, $logo, $watermarkX, $watermarkY, 0, 0, $logoWidth, $logoHeight);

        // Save the watermarked image
        imagejpeg($image, $outputFile, 100);

        // Free up memory
        imagedestroy($image);
        imagedestroy($logo);

        // Display the watermarked image
        echo '<img src="' . $outputFile . '" alt="Watermarked Image">';
    } else {
        echo "Upload failed.";
    }
}
?>
