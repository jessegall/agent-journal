<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The chat window: the agents the user can see, idle ones included, the one chosen (the main agent unless another
 * is), and the conversation with it. Without a designated main agent the installation still needs setting up.
 */
#[TypeScript]
final class ChatData extends Data
{
    /**
     * @param  list<AgentOptionData>  $agents
     */
    public function __construct(
        #[DataCollectionOf(AgentOptionData::class)]
        public readonly array $agents,
        public readonly bool $setupRequired,
        public readonly string|Optional $mainAgentId = new Optional(),
        public readonly string|Optional $selectedAgentId = new Optional(),
        public readonly ConversationData|Optional $conversation = new Optional(),
    ) {}
}
