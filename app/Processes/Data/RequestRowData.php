<?php

declare(strict_types=1);

namespace App\Processes\Data;

use App\Models\CommandRules\CommandRequest;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One command request in the review list: what it holds, why, and where it stands.
 */
#[TypeScript]
final class RequestRowData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $operation,
        public readonly string $line,
        public readonly string $holdReason,
        public readonly string $state,
        public readonly string $next,
    ) {}

    public static function fromRequest(CommandRequest $request): self
    {
        return new self(
            $request->id,
            $request->operation,
            $request->source_excerpt,
            $request->hold_reason->value,
            $request->status->value,
            $request->next_step->command,
        );
    }
}
