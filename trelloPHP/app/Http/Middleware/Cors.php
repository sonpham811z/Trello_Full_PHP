<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Cors
{
    public function handle(Request $request, Closure $next)
    {
        $origin = $request->headers->get('Origin');

        $allowed = [
            'http://localhost:5173',
            'http://127.0.0.1:5173',
        ];

        $allowOrigin = in_array($origin, $allowed) ? $origin : 'null';

        if ($request->getMethod() === "OPTIONS") {
            return response('', 200, [
                "Access-Control-Allow-Origin" => $allowOrigin,
                "Access-Control-Allow-Methods" => "GET, POST, PUT, PATCH, DELETE, OPTIONS",
                "Access-Control-Allow-Headers" => "Content-Type, Authorization, X-Requested-With, Accept",
                "Access-Control-Allow-Credentials" => "true",
            ]);
        }

        return $next($request)
            ->header("Access-Control-Allow-Origin", $allowOrigin)
            ->header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
            ->header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept")
            ->header("Access-Control-Allow-Credentials", "true");
    }
}

?>