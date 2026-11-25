<?php

declare(strict_types=1);

namespace App\Data\Processes;

use App\Models\CommandRules\CommandRequest;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One part of an explained line the journal will not run yet: its node, the stable code of why, the canonical
 * operation, and, once explain opened it, the command request that holds it with its state and next allowed command.
 */
#[TypeScript]
final class HeldPartData extends Data
{
    public function __construct(
        public readonly int $node,
        public readonly string $code,
        public readonly string $operation,
        public readonly string $holdReason,
        public readonly string $requestId = '',
        public readonly string $requestState = '',
        public readonly string $next = '',
    ) {}

    /**
     * The same held part, now with the command request that holds its work.
     */
    public function heldIn(CommandRequest $request): self
    {
        return clone ($this, [
            'requestId' => $request->id,
            'requestState' => $request->status->value,
            'next' => $request->next_step->command,
        ]);
    }
}
