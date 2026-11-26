<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Domain\Chat\Values\DockDefinition;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A source to dock in one chat, named by its inbox: its type, its id and the presentation.
 */
#[TypeScript]
final class DockInput extends Data
{
    public function __construct(
        #[Ulid]
        public readonly string $inboxId,
        #[Max(64)]
        public readonly string $type,
        #[Max(255)]
        public readonly string $id,
        #[Max(64)]
        public readonly string $presentation = DockDefinition::DEFAULT_PRESENTATION,
    ) {}
}
