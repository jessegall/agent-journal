<?php

declare(strict_types=1);

namespace App\Terminals\Data;

use App\Terminals\Enums\TerminalGrantStatus;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A browser writer's control of an agent's terminal as the writer's tab holds it: the take, the opaque grant id once
 * the host issued it, where it stands, how long it lasts unrenewed, the next input sequence it expects and, when
 * asked for, what became of one input.
 */
#[TypeScript]
final class TerminalControlData extends Data
{
    public function __construct(
        public readonly string $takeId,
        public readonly string|null $grantId,
        public readonly TerminalGrantStatus $status,
        public readonly int $expiresInSeconds,
        public readonly int $nextSequence,
        // Whether the host offers private entry for this terminal; without it no private field is offered.
        public readonly bool $isPrivateEntry,
        public readonly TerminalReceiptData|Optional $receipt = new Optional(),
    ) {}
}
