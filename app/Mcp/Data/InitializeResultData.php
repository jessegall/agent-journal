<?php

declare(strict_types=1);

namespace App\Mcp\Data;

use Spatie\LaravelData\Data;

/**
 * The part of an initialize answer the relay keeps: the protocol version the journal negotiated.
 */
final class InitializeResultData extends Data
{
    public function __construct(public readonly string $protocolVersion) {}
}
