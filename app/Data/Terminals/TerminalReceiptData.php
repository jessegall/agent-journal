<?php

declare(strict_types=1);

namespace App\Data\Terminals;

use App\Enums\TerminalReceiptOutcome;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What became of the input a browser writer sent at one sequence of their grant; it never carries the text.
 */
#[TypeScript]
final class TerminalReceiptData extends Data
{
    public function __construct(
        public readonly int $sequence,
        public readonly TerminalReceiptOutcome $outcome,
        // The rows and columns a resize achieved, as rowsxcolumns; none for any other input.
        public readonly string|null $achievedSize = null,
    ) {}
}
