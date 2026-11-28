<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Pages;

use App\Accounts\Contracts\StartAccounts;
use App\Accounts\NoAccountsYet;
use App\Exceptions\InboxUnavailable;
use App\Exceptions\PrivateRecordMissing;
use App\Exceptions\StackTargetRefused;
use App\Models\Agents\Agent;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Navigation\Contracts\SlotSections;
use App\Reads\PageFormRequests;
use App\Sessions\Contracts\AgentDirectory;
use App\Support\ActorReference;
use App\Support\AgentOption;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutPartData;
use App\Web\Creation\Contracts\PageBuilder;
use Domain\Chat\Data\AgentOptionData;
use Domain\Chat\Data\ChatData;
use Domain\Chat\Data\ChatDataFields;
use Domain\Chat\Data\ConversationData;
use Domain\Chat\Http\Requests\ConversationRequest;
use Domain\Chat\Resolvers\Support\ChatPages;
use Domain\Chat\Support\AgentListing;
use Domain\Chat\Support\PairChats;
use Illuminate\Http\Request;
use PhpOption\Option;
use Spatie\LaravelData\Optional;

/**
 * The chat window, on Home and on its own page: every agent the user can see, idle ones included, the chosen one
 * (the main agent unless the query names another) and one conversation, the chosen agent's or the one a reload names,
 * which is there with or without a session. An agent out of sight is refused like a missing one.
 */
final readonly class ChatPageBuilder implements PageBuilder
{
    private const string PAGE = 'chat.conversation';

    private const string INBOX_MISSING = 'Ask the project administrator to restore your inbox.';

    public function __construct(
        private PageFormRequests $requests,
        private AgentDirectory $agents,
        private ChatPages $pages,
        private PairChats $chats,
        private SlotSections $slots,
        private AgentListing $listing,
        private StartAccounts $startAccounts,
    ) {}

    public function build(Request $visit): ChatData
    {
        $input = $this->requests->from(ConversationRequest::class, $visit);

        $agents = $this->listing->visible();
        $main = $this->agents->mainAgentId();
        $chosenInbox = $input->chosenInbox();

        if ($chosenInbox->isDefined()) {
            return $this->readChat($input, $agents, $main, $chosenInbox->get());
        }

        $chosen = $input->chosenAgent()->orElse($main)->map($this->visibleOrPrivate(...));
        // One conversation per read: the chosen agent's, or the one a column's own reload names.
        $read = $input->columnAgent()->map($this->visibleOrPrivate(...))->orElse($chosen);

        $fields = $this->fields($agents, $main)
            ->selectedAgentId($chosen->map(fn (AgentOption $agent) => $agent->agentId)->getOrElse(Optional::create()));

        if ($read->isDefined()) {
            $conversation = $this->conversationFor($input, $read->get());

            if ($conversation instanceof ConversationData) {
                $fields->conversation($conversation);
            } else {
                $fields->setupNotice($conversation);
            }
        }

        return $this->finish($fields);
    }

    /**
     * The chat window on a chat chosen by its inbox, with or without an agent in it; a chat the reader is not in is
     * refused like a missing one.
     *
     * @param  list<AgentOptionData>  $agents
     * @param  Option<string>  $main
     */
    private function readChat(ConversationRequest $input, array $agents, Option $main, string $inboxId): ChatData
    {
        $inbox = $this->chats->attached($inboxId);

        return $this->finish($this->fields($agents, $main)
            ->selectedInboxId($inboxId)
            ->conversation($this->pages->pageFor(null, $inbox, $input->dockToken())));
    }

    /**
     * @param list<AgentOptionData> $agents
     * @param Option<string> $main
     */
    private function fields(array $agents, Option $main): ChatDataFields
    {
        return ChatData::build()
            ->agents($agents)
            ->isSetupRequired($main->isEmpty())
            ->mainAgentId($main->getOrElse(Optional::create()));
    }

    private function finish(ChatDataFields $fields): ChatData
    {
        $chats = $this->chats->joined()->limit(InboxMember::ATTACHED_LIMIT)->get();

        return $fields
            ->dockSections($this->slots->sectionsIn(self::PAGE, 'dock'))
            ->chats($this->pages->summariesOf($chats))
            ->canCreateChats($this->chats->mayCreate())
            ->noAccounts($this->noAccounts())
            ->finish();
    }

    /**
     * The No accounts yet state while no account is signed in, its action opening the account wizard.
     */
    private function noAccounts(): LayoutPartData|Optional
    {
        if ($this->startAccounts->hasSignedInAccount()) {
            return Optional::create();
        }

        $wizard = LayoutActionData::build()->href(route('accounts.accounts', ['add' => '1'], false))->finish();

        return NoAccountsYet::addingWith($wizard)->page();
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
     */
    private function conversationFor(ConversationRequest $input, AgentOption $agent): ConversationData|string
    {
        try {
            return $this->conversationWith($input, $agent);
        } catch (InboxUnavailable) {
            return self::INBOX_MISSING;
        }
    }

    private function conversationWith(ConversationRequest $input, AgentOption $agent): ConversationData
    {
        $inboxId = $this->chats->pairWith(ActorReference::ofClass(Agent::class, $agent->agentId));

        $inbox = Inbox::query()->findOrFail($inboxId);

        return $this->pages->pageFor($agent, $inbox, $input->dockToken());
    }
}
