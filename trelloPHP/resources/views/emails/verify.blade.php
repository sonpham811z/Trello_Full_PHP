<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Xác minh tài khoản</title>
</head>
<body>
    <h2>Xin chào {{ $user->display_name ?? $user->username }}</h2>
    <p>Nhấn vào liên kết dưới đây để xác minh email của bạn:</p>
    <a href="{{ $url }}">{{ $url }}</a>
</body>
</html>
