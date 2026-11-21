<?php

declare(strict_types=1);

namespace App\Agents\Data;

use Spatie\LaravelData\Data;

/**
 * The protected host's answer to a start: the execution it runs and when it started.
 */
final class HostStartReplyData extends Data
{
    public function __construct(
        public readonly string $execution,
        public readonly string $startedAt,
    ) {}
}
