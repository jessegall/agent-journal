<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One page of the chat list, the agents whose chat with the viewer moved most recently first, and where the next page
 * starts; none after the last page.
 */
#[TypeScript]
final class AgentPageData extends Data
{
    /**
     * @param  list<AgentOptionData>  $agents
     */
    public function __construct(
        #[DataCollectionOf(AgentOptionData::class)]
        public readonly array $agents,
        public readonly AgentPageCursorData|null $next,
    ) {}
}
