<?php

declare(strict_types=1);

namespace App\Agents\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The read interest a viewer holds in a runtime's terminal: which, the id the opening view addresses it by, how often
 * it refreshes, how long it stays live unrenewed and whether it is live at all, as a retried open of an ended one
 * answers. It grants reading only.
 */
#[TypeScript]
final class TerminalInterestData extends Data
{
    public function __construct(
        public readonly string $viewId,
        public readonly string $readInterestId,
        public readonly string $runtimeId,
        public readonly int $intervalMs,
        public readonly int $expiresInSeconds,
        public readonly bool $live,
    ) {}
}
