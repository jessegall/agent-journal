<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A waiting message an inspector cancels, with the reason everyone at its inboxes will read.
 */
#[TypeScript]
final class CancelInput extends Data
{
    public function __construct(
        #[Ulid] public readonly string $messageId,
        #[Regex('/\\S/'), Max(2000)] public readonly string $reason,
    ) {}
}
