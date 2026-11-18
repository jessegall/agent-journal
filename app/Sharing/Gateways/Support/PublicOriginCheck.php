<?php

declare(strict_types=1);

namespace App\Sharing\Gateways\Support;

/**
 * Whether an address a gateway reports is exactly its configured public origin: HTTPS, the same host, and no port,
 * path, query or credentials of its own. Any other address fails closed.
 */
final readonly class PublicOriginCheck
{
    public function accepts(string $address, string $publicOrigin): bool
    {
        $host = parse_url($publicOrigin, PHP_URL_HOST);

        if (! is_string($host)) {
            return false;
        }

        $origin = "https://{$host}";

        return in_array($publicOrigin, [$origin, "{$origin}/"], true) && in_array($address, [$origin, "{$origin}/"], true);
    }
}
