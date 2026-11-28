<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The agent whose technical log the chat's Technical details panel reads.
 */
#[TypeScript]
final class AgentLogInput extends Data
{
    public function __construct(
        #[Ulid]
        public readonly string $agent,
    ) {}
}
