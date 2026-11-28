<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Exceptions\StackTargetRefused;
use App\Models\Agents\Agent;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Sessions\Contracts\AgentDirectory;
use App\Support\ActorReference;
use App\Values\ProjectOwner;
use Domain\Chat\Contracts\Docking\DockableProvider;
use Domain\Chat\Contracts\Docking\DockRegistry;
use Domain\Chat\Exceptions\ChatUnavailable;
use Domain\Chat\Exceptions\DockDefinitionInvalid;
use Domain\Chat\Exceptions\DockSourceUnavailable;
use Domain\Chat\Support\Cards\DockIdentity;
use Domain\Chat\Values\DockDefinition;
use Illuminate\Container\Container;

/**
 * What a dock or an undock checks before it touches the dock: the chat the actor is a member of, named by its inbox,
 * then the source through its registered owner, readable now and of the type it was registered as, apart from any
 * placement.
 */
final readonly class DockRequests
{
    public function __construct(
        private AgentDirectory $agents,
        private ChatDirectory $chats,
        private DockRegistry $registry,
        private Container $container,
    ) {}

    /**
     * The pair chat the current actor holds with the agent, opened the first time.
     *
     * @throws ChatUnavailable
     */
    public function inboxWith(string $agentId): Inbox
    {
        try {
            $agent = $this->agents->visibleAgent($agentId);
        } catch (StackTargetRefused $refused) {
            throw ChatUnavailable::withHiddenAgent($agentId, $refused);
        }

        return Inbox::query()->findOrFail(
            $this->chats->pairWith(ActorReference::ofClass(Agent::class, $agent->agentId)),
        );
    }

    /**
     * The chats the current actor is attached to now, as the choices an Add to chat offers: each inbox id with its
     * label.
     *
     * @return list<array{value: string, label: string}>
     */
    public function joinedChats(): array
    {
        return array_values($this->chats->joined()->limit(InboxMember::ATTACHED_LIMIT)->get()
            ->map(fn (Inbox $inbox) => [
                'value' => $inbox->id,
                'label' => $inbox->label,
            ])
            ->all());
    }

    /**
     * The chat a journal caller means: the one whose inbox it names, which it must be attached to, or else the only
     * one it has. With several and none named it refuses, and docks nothing.
     *
     * @throws ChatUnavailable
     */
    public function chosenInbox(string|null $chat): Inbox
    {
        if ($chat !== null) {
            return $this->chats->attached($chat);
        }

        $joined = $this->chats->joined()->limit(2)->get();

        if ($joined->isEmpty()) {
            throw ChatUnavailable::none();
        }

        if ($joined->count() > 1) {
            throw ChatUnavailable::unnamed();
        }

        return $joined->sole();
    }

    /**
     * The chat a dock or undock changes, chosen as chosenInbox does, under its row lock.
     *
     * @throws ChatUnavailable
     */
    public function lockedInbox(string|null $chat): Inbox
    {
        return Inbox::findLockedById($this->chosenInbox($chat)->id);
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

        $definition->assertOwns($this->providerOf($definition)->requireReadable($definition, $source->id));
    }

    /**
     * The project of a source that assertReadable let through, or Global, as its registered owner answers it.
     *
     * @throws DockSourceUnavailable
     */
    public function ownerOf(DockIdentity $source): ProjectOwner
    {
        $definition = $this->registry->definition($source->type);

        return $this->providerOf($definition)->ownerOf($definition, $source->id);
    }

    private function providerOf(DockDefinition $definition): DockableProvider
    {
        /**
         * @var DockableProvider $provider
         */
        $provider = $this->container->make($definition->provider);

        return $provider;
    }
}
