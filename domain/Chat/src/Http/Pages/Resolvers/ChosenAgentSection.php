<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Pages\Resolvers;

use App\Declarations\SlotContext;
use App\Navigation\Contracts\SectionResolver;
use App\Sessions\Contracts\AgentDirectory;
use App\Support\AgentOption;
use Domain\Chat\Data\ChatData;
use Domain\Chat\Http\Requests\ConversationRequest;
use Domain\Chat\Support\AgentListing;
use Spatie\LaravelData\Optional;

/**
 * Home's agent bar: every agent the user can see, the one the page chose (the main agent unless the query's agent
 * names another) with its state and actions. An agent out of sight is refused like a missing one.
 */
final readonly class ChosenAgentSection implements SectionResolver
{
    public function __construct(
        private ConversationRequest $request,
        private AgentDirectory $agents,
        private AgentListing $listing,
    ) {}

    public function read(SlotContext $context): ChatData
    {
        $main = $this->agents->mainAgentId();
        $chosen = $this->request->chosenAgent()->orElse($main)->map($this->agents->visibleAgent(...));

        return ChatData::build()
            ->agents($this->listing->visible())
            ->isSetupRequired($main->isEmpty())
            ->mainAgentId($main->getOrElse(Optional::create()))
            ->selectedAgentId(
                $chosen
                ->map(fn (AgentOption $agent) => $agent->agentId)
                ->getOrElse(Optional::create()),
            )
            ->finish();
    }
}
