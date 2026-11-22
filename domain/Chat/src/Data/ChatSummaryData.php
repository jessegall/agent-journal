<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One chat the viewer is in, as the inbox selector lists it: its inbox, its title and how much the viewer has not read.
 */
#[TypeScript]
final class ChatSummaryData extends Data
{
    public function __construct(
        public readonly string $inboxId,
        public readonly string $label,
        public readonly int $unread,
    ) {}
}
