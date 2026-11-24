<?php

declare(strict_types=1);

namespace App\Data\Terminals;

use App\Enums\TerminalFrameState;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A viewer's answer about an agent's terminal: its state, the screen identity it belongs to, the latest frame when one
 * may be shown and when the journal received it, how many milliseconds the host's liveness proof has left by the
 * server's clock, so a cached or repeated answer never extends it, and when the terminal ended once it did.
 */
#[TypeScript]
final class TerminalFrameData extends Data
{
    public function __construct(
        public readonly TerminalFrameState $state,
        public readonly TerminalScreenIdentityData|Optional $identity = new Optional(),
        public readonly ScreenFrameData|Optional $frame = new Optional(),
        public readonly CarbonImmutable|Optional $receivedAt = new Optional(),
        public readonly CarbonImmutable|Optional $endedAt = new Optional(),
        public readonly int|Optional $liveForMs = new Optional(),
    ) {}
}
