<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * How many of an inbox's incoming messages are unread, and how many waiting ones nobody or somebody has taken up.
 */
#[TypeScript]
final class InboxCounts extends Data
{
    public function __construct(
        public readonly int $unread,
        public readonly int $unclaimed,
        public readonly int $claimed,
    ) {}
}
