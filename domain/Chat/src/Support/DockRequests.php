<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\AgentDirectory;
use App\Agents\Exceptions\StackTargetRefused;
use App\Communication\Contracts\InboxResolver;
use App\Communication\Support\ChatInboxes;
use App\Communication\Support\InboxMembers;
use App\Docking\Cards\DockIdentity;
use App\Docking\Exceptions\DockDefinitionInvalid;
use App\Docking\Exceptions\DockSourceUnavailable;
use App\Docking\Sources\Contracts\DockableProvider;
use App\Docking\Sources\Contracts\DockRegistration;
use App\Docking\Sources\DockDefinition;
use Domain\Chat\Exceptions\ConversationUnavailable;
use Domain\Chat\Models\Conversation;
use Illuminate\Container\Container;
use Illuminate\Database\Eloquent\Builder;

/**
 * What a dock or an undock checks before it touches the dock: the chat the actor is a member of, named by its inbox,
 * then the source through its registered owner, readable now and of the type it was registered as, apart from any
 * placement.
 */
final readonly class DockRequests
{
    public function __construct(
        private AgentDirectory $agents,
        private PairChats $pairs,
        private AuthorizedConversations $conversations,
        private ChatInboxes $chats,
        private InboxResolver $inboxes,
        private CurrentActor $actors,
        private DockRegistration $registry,
        private Container $container,
    ) {}

    /**
     * The direct chat the current actor holds with the agent, opened the first time.
     *
     * @throws ConversationUnavailable
     */
    public function conversationWith(string $agentId): Conversation
    {
        try {
            $agent = $this->agents->visibleAgent($agentId);
        } catch (StackTargetRefused $refused) {
            throw ConversationUnavailable::withPeer($refused);
        }

        return $this->pairs->open($this->actor(), $agent);
    }

    /**
     * The chat a caller means by its inbox id, which it must be a member of now.
     *
     * @throws ConversationUnavailable
     */
    public function conversationIn(string $inboxId): Conversation
    {
        return $this->conversations->inInbox($inboxId);
    }

    /**
     * The chats the current actor is a member of now, as the choices an Add to chat offers: each inbox id with the
     * chat's label.
     *
     * @return list<array{value: string, label: string}>
     */
    public function joinedChats(): array
    {
        $inboxIds = $this->joined()->limit(InboxMembers::LIMIT)->pluck('inbox_id')->all();

        return array_values(array_map(fn (string $inboxId) => [
            'value' => $inboxId,
            'label' => $this->inboxes->resolve($inboxId)->inboxLabel(),
        ], array_map(strval(...), $inboxIds)));
    }

    /**
     * The chat a journal caller means: the one whose inbox it names, which it must be a member of, or else the only
     * one it has. With several and none named it refuses, and docks nothing.
     *
     * @throws ConversationUnavailable
     */
    public function chosenConversation(string|null $chat): Conversation
    {
        if ($chat !== null) {
            return $this->conversationIn($chat);
        }

        $joined = $this->joined()->limit(2)->get();

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

    /**
     * @return Builder<Conversation>
     */
    private function joined(): Builder
    {
        return Conversation::query()->whereIn('inbox_id', $this->chats->memberInboxIds($this->actor()));
    }
}
