<?php

declare(strict_types=1);

namespace App\Hosts;

/**
 * The one way an instruction's payload is written as JSON, so the bytes the host receives are the bytes its signature
 * covers.
 */
final readonly class HostPayloadJson
{
    /**
     * @param  array<string, mixed>  $payload
     */
    public static function encode(array $payload): string
    {
        if ($payload === []) {
            return '{}';
        }

        return json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    }
}
