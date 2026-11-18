<?php

declare(strict_types=1);

namespace App\Processes\Data;

use App\Processes\Models\CommandRequest;
use Spatie\LaravelData\Data;

/**
 * One command request in the review list: what it holds, why, and where it stands.
 */
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
            $request->state->value,
            $request->nextStep()->command,
        );
    }
}
