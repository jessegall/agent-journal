<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A placement to undock from the conversation with an agent, named with the source it docks.
 */
#[TypeScript]
final class UndockInput extends Data
{
    public function __construct(
        #[Ulid]
        public readonly string $agent,
        #[Ulid]
        public readonly string $placementId,
        #[Max(64)]
        public readonly string $type,
        #[Max(255)]
        public readonly string $id,
    ) {}
}
