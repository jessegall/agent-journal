<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\Validation\Date;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Where the chat list's next page starts: after this agent, whose chat with the viewer last moved at that time, or
 * never moved.
 */
#[TypeScript]
final class AgentPageCursorData extends Data
{
    public function __construct(
        #[Ulid]
        public readonly string $afterAgentId,
        #[Date]
        public readonly string|null $afterActiveAt = null,
    ) {}
}
