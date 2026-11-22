<?php

declare(strict_types=1);

namespace App\Ui\Layout;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One piece of a fact's value: its label, and the page it opens when the viewer may open it.
 */
#[TypeScript]
final class LayoutFactPieceData extends Data
{
    public function __construct(
        public readonly string $label,
        public readonly string|Optional $href = new Optional(),
    ) {}
}
