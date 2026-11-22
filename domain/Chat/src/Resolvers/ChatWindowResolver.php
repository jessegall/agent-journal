<?php

declare(strict_types=1);

namespace Domain\Chat\Resolvers;

use App\Agents\Contracts\AgentDirectory;
use App\Agents\Support\AgentOption;
use App\Communication\Contracts\ConversationResolver;
use App\Communication\Data\MessagePage;
use App\Http\Data\Profiles\EligibleAccountsData;
use App\Profiles\Contracts\StartAccounts;
use App\Ui\Contracts\PageResolver;
use App\Ui\Contracts\SlotSections;
use Domain\Chat\Data\ChatData;
use Domain\Chat\Data\ConversationData;
use Domain\Chat\Data\FocusedQuestionData;
use Domain\Chat\Http\Requests\ConversationRequest;
use Domain\Chat\Support\AuthorizedConversations;
use Domain\Chat\Support\DockProjection;
use Spatie\LaravelData\Optional;

/**
 * The chat window, on Home and on its own page: every agent the user can see, idle ones included, the chosen one
 * (the main agent unless the query names another) and its conversation, which is there with or without a session,
 * and the one question a notification opened. An agent out of sight is refused like a missing one.
 */
final readonly class ChatWindowResolver implements PageResolver
{
    private const string PAGE = 'chat.conversation';

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
        $chosen = $this->request->chosenAgent()->orElse($main)->map($this->agents->visibleAgent(...));

        return ChatData::from([
            'agents' => $agents,
            'setupRequired' => $main->isEmpty(),
            'mainAgentId' => $main->getOrElse(Optional::create()),
            'selectedAgentId' => $chosen
                ->map(fn (AgentOption $agent) => $agent->agentId)
                ->getOrElse(Optional::create()),
            'conversation' => $chosen->map($this->conversationWith(...))->getOrElse(Optional::create()),
            'dockSections' => $this->slots->sectionsIn(self::PAGE, 'dock'),
            ...$this->eligibleAccounts(),
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
     * The eligible accounts a start or switch form asked for, under the key ChatData reads them by.
     *
     * @return array<string, EligibleAccountsData>
     */
    private function eligibleAccounts(): array
    {
        $asked = [];

        foreach ($this->request->accountDrivers() as $driver) {
            $asked['eligibleAccounts'] = $this->startAccounts->forDriver($driver);
        }

        return $asked;
    }

    private function conversationWith(AgentOption $agent): ConversationData
    {
        $peers = $this->conversations->withAgent($agent->agentId);
        $page = $this->messages->between($peers->ownInboxId, $peers->peerInboxId, null, MessagePage::DEFAULT_LIMIT);
        $dock = $this->dock->page($peers, $this->request->dockToken());

        return ConversationData::fromPage(
            $peers->ownInboxId,
            $peers->peerInboxId,
            $page,
            $agent,
            $dock,
        );
    }
}
