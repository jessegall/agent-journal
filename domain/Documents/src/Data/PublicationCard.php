<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Domain\Documents\Enums\AttentionState;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One document or report as a list shows it.
 */
#[TypeScript]
final class PublicationCard extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $number,
        public readonly string $title,
        public readonly string $abstract,
        public readonly AttentionState $attention,
        public readonly string|Optional $snippet = new Optional(),
        public readonly string|Optional $foundIn = new Optional(),
    ) {}
}
