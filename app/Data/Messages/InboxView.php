<?php

declare(strict_types=1);

namespace App\Data\Messages;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One inbox the reader sits at: its id, its label and what waits in it.
 */
#[TypeScript]
final class InboxView extends Data
{
    public function __construct(
        public readonly string $inboxId,
        public readonly string $label,
        public readonly InboxCounts $counts,
    ) {}
}
