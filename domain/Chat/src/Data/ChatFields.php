<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Navigation\Data\Pages\SlotSectionData;
use App\Support\Layout\LayoutPartData;
use App\Web\Creation\Exceptions\MissingFields;
use Spatie\LaravelData\Optional;

abstract class ChatFields
{
    /** @var list<AgentOptionData> */
    private array $agents;

    private bool $isSetupRequired;

    private string|Optional $mainAgentId;

    private string|Optional $selectedAgentId;

    /** @var list<SlotSectionData> */
    private array $dockSections = [];

    private ConversationData|Optional $conversation;

    private string|Optional $setupNotice;

    /** @var list<ChatSummaryData> */
    private array $chats = [];

    private bool $canCreateChats = false;

    private string|Optional $selectedInboxId;

    private LayoutPartData|Optional $noAccounts;

    private AgentPageCursorData|null $nextAgents = null;

    /** Starts with optional selection and conversation data absent. */
    public function __construct()
    {
        $this->mainAgentId = new Optional();
        $this->selectedAgentId = new Optional();
        $this->conversation = new Optional();
        $this->setupNotice = new Optional();
        $this->selectedInboxId = new Optional();
        $this->noAccounts = new Optional();
    }

    /** @param list<AgentOptionData> $agents */
    public function agents(array $agents): static
    {
        $this->agents = $agents;

        return $this;
    }

    /** Whether the page still needs its main agent. */
    public function isSetupRequired(bool $isSetupRequired): static
    {
        $this->isSetupRequired = $isSetupRequired;

        return $this;
    }

    /** The project's main agent, when one has been created. */
    public function mainAgentId(string|Optional $agentId): static
    {
        $this->mainAgentId = $agentId;

        return $this;
    }

    /** The agent selected in the current visit. */
    public function selectedAgentId(string|Optional $agentId): static
    {
        $this->selectedAgentId = $agentId;

        return $this;
    }

    /** @param list<SlotSectionData> $dockSections */
    public function dockSections(array $sections): static
    {
        $this->dockSections = $sections;

        return $this;
    }

    /** The conversation selected for the current visit. */
    public function conversation(ConversationData|Optional $conversation): static
    {
        $this->conversation = $conversation;

        return $this;
    }

    /** The instruction shown when the selected conversation needs setup. */
    public function setupNotice(string|Optional $notice): static
    {
        $this->setupNotice = $notice;

        return $this;
    }

    /** @param list<ChatSummaryData> $chats */
    public function chats(array $chats): static
    {
        $this->chats = $chats;

        return $this;
    }

    /** Whether the viewer can open another conversation. */
    public function canCreateChats(bool $canCreateChats): static
    {
        $this->canCreateChats = $canCreateChats;

        return $this;
    }

    /** The inbox selected in the current visit. */
    public function selectedInboxId(string|Optional $inboxId): static
    {
        $this->selectedInboxId = $inboxId;

        return $this;
    }

    /** The setup action shown while no account can start a session. */
    public function noAccounts(LayoutPartData|Optional $notice): static
    {
        $this->noAccounts = $notice;

        return $this;
    }

    /** The cursor available when more agent choices remain. */
    public function nextAgents(AgentPageCursorData|null $agents): static
    {
        $this->nextAgents = $agents;

        return $this;
    }

    /**
     * @template T of ChatData|ChatWindowData
     *
     * @param  class-string<T>  $type
     * @return T
     */
    protected function complete(string $type): ChatData|ChatWindowData
    {
        if (! isset($this->agents)) {
            throw MissingFields::forType($type, 'agents');
        }

        if (! isset($this->isSetupRequired)) {
            throw MissingFields::forType($type, 'isSetupRequired');
        }

        return new $type(
            agents: $this->agents,
            isSetupRequired: $this->isSetupRequired,
            mainAgentId: $this->mainAgentId,
            selectedAgentId: $this->selectedAgentId,
            dockSections: $this->dockSections,
            conversation: $this->conversation,
            setupNotice: $this->setupNotice,
            chats: $this->chats,
            canCreateChats: $this->canCreateChats,
            selectedInboxId: $this->selectedInboxId,
            noAccounts: $this->noAccounts,
            nextAgents: $this->nextAgents,
        );
    }
}
