<?php

declare(strict_types=1);

namespace Domain\Chat\Resolvers;

use App\Agents\Contracts\AgentDirectory;
use App\Agents\Exceptions\StackTargetRefused;
use App\Agents\Support\AgentOption;
use App\Communication\Contracts\ConversationResolver;
use App\Communication\Data\MessagePage;
use App\Communication\Exceptions\InboxUnavailable;
use App\Http\Data\Profiles\EligibleAccountsData;
use App\Profiles\Contracts\StartAccounts;
use App\Ui\Contracts\PageResolver;
use App\Ui\Contracts\SlotSections;
use App\Web\Exceptions\PrivateRecordMissing;
use Domain\Chat\Data\ChatData;
use Domain\Chat\Data\ConversationData;
use Domain\Chat\Data\FocusedQuestionData;
use Domain\Chat\Http\Requests\ConversationRequest;
use Domain\Chat\Support\AuthorizedConversations;
use Domain\Chat\Support\DockProjection;
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
        private AuthorizedConversations $conversations,
        private DockProjection $dock,
        private SlotSections $slots,
        private StartAccounts $startAccounts,
    ) {}

    public function read(): ChatData
    {
        $agents = $this->agents->visible();
        $main = $this->agents->mainAgentId();
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
        ]);
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
        } catch (StackTargetRefused) {
            throw PrivateRecordMissing::forReader();
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
        $peers = $this->conversations->withVisibleAgent($agent);
        $page = $this->messages->between($peers->ownInboxId, $peers->peerInboxId, null, MessagePage::DEFAULT_LIMIT);
        $dock = $this->dock->page($peers->existingConversation(), $this->request->dockToken());

        return ConversationData::fromPage(
            $peers->ownInboxId,
            $peers->peerInboxId,
            $page,
            $agent,
            $dock,
        );
    }
}
