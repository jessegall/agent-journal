<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A document or report as a card in a session's dock: its type word and number, title, abstract and page.
 */
#[TypeScript]
final class DockSuggestion extends Data
{
    public function __construct(
        public readonly string $type,
        public readonly string $number,
        public readonly string $title,
        public readonly string $abstract,
        public readonly string $route,
    ) {}
}
