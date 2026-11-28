<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

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
use App\Support\HomeAgent;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutPartData;
use Domain\Chat\Data\AgentPageData;
use Domain\Chat\Data\ChatFields;
use Domain\Chat\Data\ConversationData;
use Domain\Chat\Http\Requests\ConversationRequest;
use Domain\Chat\Resolvers\Support\ChatPages;
use Illuminate\Http\Request;
use PhpOption\Option;
use Spatie\LaravelData\Optional;

/** Reads the chat controls and the single conversation selected by this visit. */
final readonly class ChatReader
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

    /**
     * @template T of ChatFields
     *
     * @param  T  $fields
     * @return T
     */
    public function fill(Request $visit, ChatFields $fields): ChatFields
    {
        $input = $this->requests->from(ConversationRequest::class, $visit);

        $main = $this->agents->mainAgentId();
        $chosenInbox = $input->chosenInbox();

        if ($chosenInbox->isDefined()) {
            $fields = $this->fillShell($fields, $this->listing->firstPageWith([]), $main);
            $inbox = $this->chats->attached($chosenInbox->get());

            $fields->selectedInboxId($inbox->id)
                ->conversation($this->pages->pageFor(null, $inbox, $input->dockToken()));

            return $fields;
        }

        $chosen = $input->chosenAgent()->orElse($main)->map($this->visibleOrPrivate(...));
        // One conversation per read: the chosen agent's, or the one a column's own reload names.
        $read = $input->columnAgent()->map($this->visibleOrPrivate(...))->orElse($chosen);

        $page = $this->listing->firstPageWith([...$this->idOf($chosen), ...$this->idOf($read)]);
        $fields = $this->fillShell($fields, $page, $main);
        $fields->selectedAgentId($chosen->map(fn (HomeAgent $agent) => $agent->agentId)->getOrElse(Optional::create()));

        if ($read->isDefined()) {
            $conversation = $this->conversationFor($input, $read->get());

            if ($conversation instanceof ConversationData) {
                $fields->conversation($conversation);
            } else {
                $fields->setupNotice($conversation);
            }
        }

        return $fields;
    }

    /**
     * @template T of ChatFields
     *
     * @param  T  $fields
     * @param  Option<string>  $main
     * @return T
     */
    private function fillShell(ChatFields $fields, AgentPageData $page, Option $main): ChatFields
    {
        $chats = $this->chats->joined()->limit(InboxMember::ATTACHED_LIMIT)->get();

        $fields->agents($page->agents)
            ->nextAgents($page->next)
            ->isSetupRequired($main->isEmpty())
            ->mainAgentId($main->getOrElse(Optional::create()))
            ->dockSections($this->slots->sectionsIn(self::PAGE, 'dock'))
            ->chats($this->pages->summariesOf($chats))
            ->canCreateChats($this->chats->mayCreate())
            ->noAccounts($this->noAccounts());

        return $fields;
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

    /** @param Option<HomeAgent> $agent
     * @return list<string>
     */
    private function idOf(Option $agent): array
    {
        return $agent->map(fn (HomeAgent $shown) => [$shown->agentId])->getOrElse([]);
    }

    /**
     * The chosen agent when the reader sees it; one it may not see answers as a missing record does, with no title.
     *
     * @throws PrivateRecordMissing
     */
    private function visibleOrPrivate(string $agentId): HomeAgent
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
    private function conversationFor(ConversationRequest $input, HomeAgent $agent): ConversationData|string
    {
        try {
            return $this->conversationWith($input, $agent);
        } catch (InboxUnavailable) {
            return self::INBOX_MISSING;
        }
    }

    private function conversationWith(ConversationRequest $input, HomeAgent $agent): ConversationData
    {
        $inboxId = $this->chats->pairWith(ActorReference::ofClass(Agent::class, $agent->agentId));

        $inbox = Inbox::query()->findOrFail($inboxId);

        return $this->pages->pageFor($agent, $inbox, $input->dockToken());
    }
}
