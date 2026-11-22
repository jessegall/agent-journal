<?php

declare(strict_types=1);

namespace App\Agents\Data;

use App\Agents\Enums\TerminalReceiptOutcome;
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
    ) {}
}
