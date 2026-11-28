<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Pages\Resolvers;

use App\Accounts\Contracts\StartAccounts;
use App\Accounts\NoAccountsYet;
use App\Exceptions\InboxUnavailable;
use App\Exceptions\PrivateRecordMissing;
use App\Exceptions\StackTargetRefused;
use App\Models\Agents\Agent;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Navigation\Contracts\PageResolver;
use App\Navigation\Contracts\SlotSections;
use App\Sessions\Contracts\AgentDirectory;
use App\Support\ActorReference;
use App\Support\AgentOption;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutPartData;
use Domain\Chat\Data\AgentPageData;
use Domain\Chat\Data\ChatData;
use Domain\Chat\Data\ChatDataFields;
use Domain\Chat\Data\ConversationData;
use Domain\Chat\Http\Requests\ConversationRequest;
use Domain\Chat\Resolvers\Support\ChatPages;
use Domain\Chat\Support\AgentListing;
use Domain\Chat\Support\PairChats;
use PhpOption\Option;
use Spatie\LaravelData\Optional;

/**
 * The chat window, on Home and on its own page: the first page of the agents the user can see, idle ones included,
 * the chosen one (the main agent unless the query names another) and one conversation, the chosen agent's or the one
 * a reload names, which is there with or without a session. An agent out of sight is refused like a missing one.
 */
final readonly class ChatWindowResolver implements PageResolver
{
    private const string PAGE = 'chat.conversation';

    private const string INBOX_MISSING = 'Ask the project administrator to restore your inbox.';

    public function __construct(
        private ConversationRequest $request,
        private AgentDirectory $agents,
        private ChatPages $pages,
        private PairChats $chats,
        private SlotSections $slots,
        private AgentListing $listing,
        private StartAccounts $startAccounts,
    ) {}

    public function read(): ChatData
    {
        $main = $this->agents->mainAgentId();
        $chosenInbox = $this->request->chosenInbox();

        if ($chosenInbox->isDefined()) {
            return $this->readChat($this->listing->firstPageWith([]), $main, $chosenInbox->get());
        }

        $chosen = $this->request->chosenAgent()->orElse($main)->map($this->visibleOrPrivate(...));
        // One conversation per read: the chosen agent's, or the one a column's own reload names.
        $read = $this->request->columnAgent()->map($this->visibleOrPrivate(...))->orElse($chosen);
        $page = $this->listing->firstPageWith([...$this->idOf($chosen), ...$this->idOf($read)]);

        $fields = $this->fields($page, $main)
            ->selectedAgentId($chosen->map(fn (AgentOption $agent) => $agent->agentId)->getOrElse(Optional::create()));

        if ($read->isDefined()) {
            $conversation = $this->conversationFor($read->get());

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
     * @param  Option<string>  $main
     */
    private function readChat(AgentPageData $page, Option $main, string $inboxId): ChatData
    {
        $inbox = $this->chats->attached($inboxId);

        return $this->finish($this->fields($page, $main)
            ->selectedInboxId($inboxId)
            ->conversation($this->pages->pageFor(null, $inbox, $this->request->dockToken())));
    }

    /**
     * @param Option<string> $main
     */
    private function fields(AgentPageData $page, Option $main): ChatDataFields
    {
        return ChatData::build()
            ->agents($page->agents)
            ->nextAgents($page->next)
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

    /** @param Option<AgentOption> $agent
     * @return list<string>
     */
    private function idOf(Option $agent): array
    {
        return $agent->map(fn (AgentOption $shown) => [$shown->agentId])->getOrElse([]);
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
    private function conversationFor(AgentOption $agent): ConversationData|string
    {
        try {
            return $this->conversationWith($agent);
        } catch (InboxUnavailable) {
            return self::INBOX_MISSING;
        }
    }

    private function conversationWith(AgentOption $agent): ConversationData
    {
        $inboxId = $this->chats->pairWith(ActorReference::ofClass(Agent::class, $agent->agentId));

        $inbox = Inbox::query()->findOrFail($inboxId);

        return $this->pages->pageFor($agent, $inbox, $this->request->dockToken());
    }
}
