<?php

declare(strict_types=1);

namespace Domain\Chat\Resolvers;

use App\Contracts\Accounts\StartAccounts;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Chat\ConversationResolver;
use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Navigation\PageResolver;
use App\Contracts\Navigation\SlotSections;
use App\Contracts\Sessions\AgentDirectory;
use App\Data\Accounts\EligibleAccountsData;
use App\Exceptions\InboxUnavailable;
use App\Exceptions\PrivateRecordMissing;
use App\Exceptions\StackTargetRefused;
use App\Support\ActorIdentity;
use App\Support\AgentOption;
use Domain\Chat\Commands\OpenPairChat\OpenPairChatCommand;
use Domain\Chat\Data\ChatData;
use Domain\Chat\Data\ChatSummaryData;
use Domain\Chat\Data\ConversationData;
use Domain\Chat\Data\DriverChoiceData;
use Domain\Chat\Data\FocusedQuestionData;
use Domain\Chat\Http\Requests\ConversationRequest;
use Domain\Chat\Resolvers\Support\ChatConversations;
use Domain\Chat\Support\AuthorizedConversations;
use Domain\Chat\Support\ChatAdmissionPolicy;
use PhpOption\Option;
use Spatie\LaravelData\Optional;

/**
 * The chat window, on Home and on its own page: every agent the user can see, idle ones included, the chosen one
 * (the main agent unless the query names another) and its conversation, which is there with or without a session,
 * and the one question a notification opened. An agent out of sight is refused like a missing one.
 */
final readonly class ChatWindowResolver implements PageResolver
{
    private const string PAGE = 'chat.conversation';

    private const string INBOX_MISSING = 'Ask the project administrator to restore your inbox.';

    public function __construct(
        private ConversationRequest $request,
        private AgentDirectory $agents,
        private ConversationResolver $messages,
        private ChatConversations $chats,
        private AuthorizedConversations $conversations,
        private ChatAdmissionPolicy $admission,
        private CurrentActor $actors,
        private SlotSections $slots,
        private StartAccounts $startAccounts,
        private CommandBus $commands,
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
            'setupRequired' => $main->isEmpty(),
            'mainAgentId' => $main->getOrElse(Optional::create()),
            'selectedAgentId' => $chosen
                ->map(fn (AgentOption $agent) => $agent->agentId)
                ->getOrElse(Optional::create()),
            ...$chosen->map($this->conversationFields(...))->getOrElse([]),
            'dockSections' => $this->slots->sectionsIn(self::PAGE, 'dock'),
            ...$this->eligibleAccounts($chosen),
            ...$this->focusedQuestion(),
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
        $this->conversations->inInbox($inboxId);

        return ChatData::from([
            'agents' => $agents,
            'setupRequired' => $main->isEmpty(),
            'mainAgentId' => $main->getOrElse(Optional::create()),
            'selectedAgentId' => Optional::create(),
            'selectedInboxId' => $inboxId,
            'conversation' => $this->chats->pageFor(null, $inboxId, $this->request->dockToken()),
            'dockSections' => $this->slots->sectionsIn(self::PAGE, 'dock'),
            ...$this->focusedQuestion(),
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
        $viewer = ActorIdentity::of($this->actors->actor());

        return [
            'chats' => $this->chats->summariesFor($this->messages->ownInboxes()),
            'canCreateChats' => $this->admission->mayCreate($viewer, null),
        ];
    }

    /**
     * The question a notification opened, under the keys ChatData reads it by: found by the membership of its own
     * destination inbox, whichever agent is chosen and whatever page is loaded. It reads nothing and claims nothing.
     *
     * @return array<string, string|FocusedQuestionData>
     */
    private function focusedQuestion(): array
    {
        $asked = [];

        foreach ($this->request->focusedQuestionId() as $messageId) {
            $asked['focusedQuestionId'] = $messageId;

            if (! $this->messages->canSee($messageId)) {
                continue;
            }

            $question = $this->messages->detail($messageId);

            $answer = $question->answerId !== null && $this->messages->canSee($question->answerId)
                ? $this->messages->detail($question->answerId)
                : Optional::create();

            $asked['focusedQuestion'] = new FocusedQuestionData($question, $answer);
        }

        return $asked;
    }

    /**
     * The eligible accounts a start or switch form asked for, under the key ChatData reads them by, with the models the
     * chosen agent's profile permits.
     *
     * @param  Option<AgentOption>  $chosen
     * @return array<string, EligibleAccountsData>
     */
    private function eligibleAccounts(Option $chosen): array
    {
        $asked = [];

        foreach ($this->request->accountDrivers() as $driver) {
            $asked['eligibleAccounts'] = $chosen
                ->map(fn (AgentOption $agent) => $this->startAccounts->forProfileStart($driver, $agent->profileKey))
                ->getOrCall(fn () => $this->startAccounts->forDriver($driver));
        }

        return $asked;
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
        $chatInboxId = $this->commands->run(new OpenPairChatCommand($agent->agentId));

        return $this->chats->pageFor($agent, $chatInboxId, $this->request->dockToken());
    }
}
