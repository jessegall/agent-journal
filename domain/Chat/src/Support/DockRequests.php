<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Actors\Contracts\CurrentActor;
use App\Communication\Contracts\ActorInboxResolver;
use App\Docking\Cards\DockIdentity;
use App\Docking\Exceptions\DockDefinitionInvalid;
use App\Docking\Exceptions\DockSourceUnavailable;
use App\Docking\Sources\Contracts\DockableProvider;
use App\Docking\Sources\Contracts\DockRegistration;
use App\Docking\Sources\DockDefinition;
use Domain\Chat\Exceptions\ConversationUnavailable;
use Domain\Chat\Models\Conversation;
use Illuminate\Container\Container;

/**
 * What a dock or an undock checks before it touches the dock: the conversation with the peer, then the source
 * through its registered owner, readable now and of the type it was registered as, apart from any placement.
 */
final readonly class DockRequests
{
    public function __construct(
        private AuthorizedConversations $conversations,
        private CurrentActor $actors,
        private ActorInboxResolver $inboxes,
        private DockRegistration $registry,
        private Container $container,
    ) {}

    /**
     * The conversation the current actor holds with the agent, made the first time.
     *
     * @throws ConversationUnavailable
     */
    public function conversationWith(string $agentId): Conversation
    {
        return $this->conversations->withAgent($agentId)->conversation();
    }

    /**
     * Refuses an actor whose own inbox is not one side of the conversation, the same way as an unknown one.
     *
     * @throws ConversationUnavailable
     */
    public function assertJoined(Conversation $conversation): void
    {
        if (! $conversation->joins($this->inboxes->preferredFor($this->actors->actor())->inboxId())) {
            throw ConversationUnavailable::missing($conversation->id);
        }
    }

    /**
     * Refuses a source its owner does not register, cannot show in the presentation or the actor cannot read now.
     *
     * @throws DockSourceUnavailable
     */
    public function assertReadable(
        DockIdentity $source,
        string $presentation = DockDefinition::DEFAULT_PRESENTATION,
    ): void {
        try {
            $definition = $this->registry->definition($source->type);
        } catch (DockDefinitionInvalid $unknown) {
            throw DockSourceUnavailable::unsupported($source->type, $presentation, $unknown);
        }

        if (! in_array($presentation, $definition->presentations, true)) {
            throw DockSourceUnavailable::unsupported($source->type, $presentation);
        }

        /**
         * @var DockableProvider $provider
         */
        $provider = $this->container->make($definition->provider);
        $definition->assertOwns($provider->requireReadable($definition, $source->id));
    }
}
