<?php

declare(strict_types=1);

namespace App\Agents\Data;

use App\Agents\Enums\TerminalGrantState;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A browser writer's control of an agent's terminal as the writer's tab holds it: the take, the opaque grant id once
 * the host issued it, where it stands, how long it lasts unrenewed and the next input sequence it expects.
 */
#[TypeScript]
final class TerminalControlData extends Data
{
    public function __construct(
        public readonly string $takeId,
        public readonly string|null $grantId,
        public readonly TerminalGrantState $state,
        public readonly int $expiresInSeconds,
        public readonly int $nextSequence,
    ) {}
}
