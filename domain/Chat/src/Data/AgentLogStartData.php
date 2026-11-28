<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One start of an agent in its technical log: when it began, how it ended in words, and its lines newest first.
 */
#[TypeScript]
final class AgentLogStartData extends Data
{
    /**
     * @param  list<AgentLogLineData>  $lines
     */
    public function __construct(
        public readonly string $sessionId,
        public readonly string $startedAt,
        public readonly string $outcome,
        public readonly bool $hasFailed,
        #[DataCollectionOf(AgentLogLineData::class)]
        public readonly array $lines,
    ) {}
}
