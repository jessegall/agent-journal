<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Domain\Documents\Enums\AttentionStatus;
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
        public readonly AttentionStatus $attention,
        // The project the record belongs to, or the Global key.
        public readonly string $ownerKey,
        public readonly string|Optional $snippet = new Optional(),
        public readonly string|Optional $foundIn = new Optional(),
    ) {}

    /**
     * The line a list shows under the title: where a search found it and what it found, else its abstract.
     */
    public function summaryLine(): string
    {
        if (is_string($this->snippet) && is_string($this->foundIn)) {
            return "{$this->foundIn}: {$this->snippet}";
        }

        return $this->abstract;
    }
}
