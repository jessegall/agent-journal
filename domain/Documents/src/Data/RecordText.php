<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A bounded read of a document or report: its outline with line spans, and the selected part of one revision with
 * the exact lines that continue it.
 */
#[TypeScript]
final class RecordText extends Data
{
    /**
     * @param  list<string>  $outline
     */
    public function __construct(
        public readonly string $label,
        public readonly string $revision,
        public readonly string $title,
        public readonly string $abstract,
        public readonly array $outline,
        public readonly string|Optional $text = new Optional,
        public readonly string|Optional $lines = new Optional,
        public readonly string|Optional $continuation = new Optional,
    ) {}
}
