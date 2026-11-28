<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * An agent's technical log, as the chat's Technical details panel reads it: its starts, newest first.
 */
#[TypeScript]
final class AgentLogData extends Data
{
    /**
     * @param  list<AgentLogStartData>  $starts
     */
    public function __construct(
        public readonly string $agentId,
        #[DataCollectionOf(AgentLogStartData::class)]
        public readonly array $starts,
    ) {}
}
