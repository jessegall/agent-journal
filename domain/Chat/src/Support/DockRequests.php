<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
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
        private DockRegistration $registry,
        private Container $container,
    ) {}

    /**
     * The direct chat the current actor holds with the agent.
     *
     * @throws ConversationUnavailable
     */
    public function conversationWith(string $agentId): Conversation
    {
        return $this->conversations->withAgent($agentId)->conversation();
    }

    /**
     * The conversation a journal caller means: the one it names, which it must take part in, or else the only one it
     * has. With several and none named it refuses, and docks nothing.
     *
     * @throws ConversationUnavailable
     */
    public function chosenConversation(string|null $chat): Conversation
    {
        if ($chat !== null) {
            $named = Conversation::query()
                ->whereKey($chat)
                ->firstOr(fn () => throw ConversationUnavailable::missing($chat));

            $this->assertJoined($named);

            return $named;
        }

        $joined = Conversation::query()->joinedBy($this->actor())->limit(2)->get();

        if ($joined->isEmpty()) {
            throw ConversationUnavailable::none();
        }

        if ($joined->count() > 1) {
            throw ConversationUnavailable::unnamed();
        }

        return $joined->sole();
    }

    /**
     * The conversation a dock or undock changes, chosen as chosenConversation does, under its row lock.
     *
     * @throws ConversationUnavailable
     */
    public function lockedConversation(string|null $chat): Conversation
    {
        return Conversation::lockedById($this->chosenConversation($chat)->id);
    }

    /**
     * Refuses an actor that takes no part in the conversation, the same way as an unknown one.
     *
     * @throws ConversationUnavailable
     */
    public function assertJoined(Conversation $conversation): void
    {
        if (! $conversation->joins($this->actor())) {
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

    private function actor(): ActorIdentity
    {
        return ActorIdentity::of($this->actors->actor());
    }
}
