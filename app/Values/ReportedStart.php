<?php

declare(strict_types=1);

namespace App\Values;

/**
 * The start a host reports usage on: the host, the key of a start it claimed, and the sign-in generation the host
 * says that start ran in.
 */
final readonly class ReportedStart
{
    public function __construct(public string $hostId, public string $key, public int $generation) {}
}
