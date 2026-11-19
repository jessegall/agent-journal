<?php

declare(strict_types=1);

namespace App\Agents\Data;

use App\Agents\Enums\TerminalFrameState;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A viewer's answer about an agent's terminal: its state, the latest frame when one is kept and when the journal
 * received it, and when the terminal ended once it did.
 */
#[TypeScript]
final class TerminalFrameData extends Data
{
    public function __construct(
        public readonly TerminalFrameState $state,
        public readonly ScreenFrameData|Optional $frame = new Optional(),
        public readonly CarbonImmutable|Optional $receivedAt = new Optional(),
        public readonly CarbonImmutable|Optional $endedAt = new Optional(),
    ) {}
}
