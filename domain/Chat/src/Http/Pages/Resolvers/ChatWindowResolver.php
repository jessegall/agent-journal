<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Pages\Resolvers;

use App\Contracts\Accounts\StartAccounts;
use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Navigation\PageResolver;
use App\Contracts\Navigation\SlotSections;
use App\Contracts\Sessions\AgentDirectory;
use App\Data\Accounts\EligibleAccountsData;
use App\Enums\Assignments\ActorType;
use App\Exceptions\InboxUnavailable;
use App\Exceptions\PrivateRecordMissing;
use App\Exceptions\StackTargetRefused;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Support\ActorIdentity;
use App\Support\AgentOption;
use Domain\Chat\Data\ChatData;
use Domain\Chat\Data\ChatSummaryData;
use Domain\Chat\Data\ConversationData;
use Domain\Chat\Data\DriverChoiceData;
use Domain\Chat\Http\Requests\ConversationRequest;
use Domain\Chat\Resolvers\Support\ChatPages;
use Domain\Chat\Support\ChatInboxes;
use PhpOption\Option;
use Spatie\LaravelData\Optional;

/**
 * The chat window, on Home and on its own page: every agent the user can see, idle ones included, the chosen one
 * (the main agent unless the query names another) and its conversation, which is there with or without a session.
 * An agent out of sight is refused like a missing one.
 */
final readonly class ChatWindowResolver implements PageResolver
{
    private const string PAGE = 'chat.conversation';

    private const string INBOX_MISSING = 'Ask the project administrator to restore your inbox.';

    public function __construct(
        private ConversationRequest $request,
        private AgentDirectory $agents,
        private ChatPages $pages,
        private ChatInboxes $chats,
        private SlotSections $slots,
        private StartAccounts $startAccounts,
        private DriverCatalogue $drivers,
    ) {}

    public function read(): ChatData
    {
        $agents = $this->agents->visible();
        $main = $this->agents->mainAgentId();
        $chosenInbox = $this->request->chosenInbox();

        if ($chosenInbox->isDefined()) {
            return $this->readChat($agents, $main, $chosenInbox->get());
        }

        $chosen = $this->request->chosenAgent()->orElse($main)->map($this->visibleOrPrivate(...));

        return ChatData::from([
            'agents' => $agents,
            'isSetupRequired' => $main->isEmpty(),
            'mainAgentId' => $main->getOrElse(Optional::create()),
            'selectedAgentId' => $chosen
                ->map(fn (AgentOption $agent) => $agent->agentId)
                ->getOrElse(Optional::create()),
            ...$chosen->map($this->conversationFields(...))->getOrElse([]),
            'dockSections' => $this->slots->sectionsIn(self::PAGE, 'dock'),
            'eligibleAccounts' => $this->eligibleAccounts($chosen),
            ...$this->chatList(),
            'drivers' => DriverChoiceData::listed($this->drivers),
        ]);
    }

    /**
     * The chat window on a chat chosen by its inbox, with or without an agent in it; a chat the reader is not in is
     * refused like a missing one.
     *
     * @param  list<AgentOption>  $agents
     * @param  Option<string>  $main
     */
    private function readChat(array $agents, Option $main, string $inboxId): ChatData
    {
        $inbox = $this->chats->attached($inboxId);

        return ChatData::from([
            'agents' => $agents,
            'isSetupRequired' => $main->isEmpty(),
            'mainAgentId' => $main->getOrElse(Optional::create()),
            'selectedAgentId' => Optional::create(),
            'selectedInboxId' => $inboxId,
            'conversation' => $this->pages->pageFor(null, $inbox, $this->request->dockToken()),
            'dockSections' => $this->slots->sectionsIn(self::PAGE, 'dock'),
            ...$this->chatList(),
        ]);
    }

    /**
     * The chats the viewer is in, each with its title and unread count, and whether it may open a new one.
     *
     * @return array{chats: list<ChatSummaryData>, canCreateChats: bool}
     */
    private function chatList(): array
    {
        return [
            'chats' => $this->pages->summariesOf($this->chats->joined()->limit(InboxMember::ATTACHED_LIMIT)->get()),
            'canCreateChats' => $this->chats->mayCreate(),
        ];
    }

    /**
     * The eligible accounts a start or switch form asked for, with the models the chosen agent's profile permits; none
     * when the form asked for none.
     *
     * @param  Option<AgentOption>  $chosen
     */
    private function eligibleAccounts(Option $chosen): EligibleAccountsData|Optional
    {
        $askedDriver = $this->request->accountDriver();

        if ($askedDriver->isEmpty()) {
            return Optional::create();
        }

        $driver = $askedDriver->get();

        return $chosen
            ->map(fn (AgentOption $agent) => $this->startAccounts->forProfileStart($driver, $agent->profileKey))
            ->getOrCall(fn () => $this->startAccounts->forDriver($driver));
    }

    /**
     * The chosen agent when the reader sees it; one it may not see answers as a missing record does, with no title.
     *
     * @throws PrivateRecordMissing
     */
    private function visibleOrPrivate(string $agentId): AgentOption
    {
        try {
            return $this->agents->visibleAgent($agentId);
        } catch (StackTargetRefused $refused) {
            throw PrivateRecordMissing::forReader($refused);
        }
    }

    /**
     * The conversation with the chosen agent, or, when the reader's own inbox is missing, the setup notice that
     * replaces it: ready data the project administrator must act on, never a failure to reload.
     *
     * @return array{conversation?: ConversationData, setupNotice?: string}
     */
    private function conversationFields(AgentOption $agent): array
    {
        try {
            return ['conversation' => $this->conversationWith($agent)];
        } catch (InboxUnavailable) {
            return ['setupNotice' => self::INBOX_MISSING];
        }
    }

    private function conversationWith(AgentOption $agent): ConversationData
    {
        $inboxId = $this->chats->pairWith(new ActorIdentity(ActorType::Agent, $agent->agentId));

        return $this->pages->pageFor($agent, Inbox::query()->findOrFail($inboxId), $this->request->dockToken());
    }
}
