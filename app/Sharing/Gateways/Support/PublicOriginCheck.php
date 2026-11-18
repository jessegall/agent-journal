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
        $parts = parse_url($address);
        $expected = parse_url($publicOrigin);

        return is_array($parts) && is_array($expected)
            && ($parts['scheme'] ?? null) === 'https'
            && ($expected['scheme'] ?? null) === 'https'
            && ($parts['host'] ?? null) === ($expected['host'] ?? false)
            && in_array($parts['path'] ?? '', ['', '/'], true)
            && ! isset($parts['port'])
            && ! isset($parts['query'])
            && ! isset($parts['user']);
    }
}
