<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Enums\WakeState;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * How far one recipient of a chat row was woken, as its author or an operator sees it: who, where it stands and,
 * once given up, why, from which character the text still waits and the piece a retry asks for again.
 */
#[TypeScript]
final class DeliveryData extends Data
{
    public function __construct(
        public readonly string $recipient,
        public readonly string $label,
        public readonly WakeState $state,
        public readonly string|null $reason,
        public readonly int|null $pendingFrom,
        public readonly string|null $rangeId,
    ) {}
}
