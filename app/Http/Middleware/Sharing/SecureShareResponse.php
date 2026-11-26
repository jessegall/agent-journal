<?php

declare(strict_types=1);

namespace App\Http\Middleware\Sharing;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Gives every answer of the share listener the same safe headers: never stored, no referrer, no frames, no indexing,
 * a strict content policy, and no cookie.
 */
final readonly class SecureShareResponse
{
    private const array HEADERS = [
        'Cache-Control' => 'no-store',
        'Referrer-Policy' => 'no-referrer',
        'Content-Security-Policy' => "default-src 'none'; style-src 'self'; img-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
        'X-Frame-Options' => 'DENY',
        'X-Robots-Tag' => 'noindex, nofollow, noarchive',
        'X-Content-Type-Options' => 'nosniff',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        foreach ($response->headers->getCookies() as $cookie) {
            $response->headers->removeCookie($cookie->getName(), $cookie->getPath(), $cookie->getDomain());
        }

        $response->headers->add(self::HEADERS);

        return $response;
    }
}
