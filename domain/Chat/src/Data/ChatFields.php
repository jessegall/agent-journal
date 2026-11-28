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
    public function agents(array $agents): self
    {
        $this->agents = $agents;

        return $this;
    }

    public function isSetupRequired(bool $isSetupRequired): self
    {
        $this->isSetupRequired = $isSetupRequired;

        return $this;
    }

    public function mainAgentId(string|Optional $mainAgentId): self
    {
        $this->mainAgentId = $mainAgentId;

        return $this;
    }

    public function selectedAgentId(string|Optional $selectedAgentId): self
    {
        $this->selectedAgentId = $selectedAgentId;

        return $this;
    }

    /** @param list<SlotSectionData> $dockSections */
    public function dockSections(array $dockSections): self
    {
        $this->dockSections = $dockSections;

        return $this;
    }

    public function conversation(ConversationData|Optional $conversation): self
    {
        $this->conversation = $conversation;

        return $this;
    }

    public function setupNotice(string|Optional $setupNotice): self
    {
        $this->setupNotice = $setupNotice;

        return $this;
    }

    /** @param list<ChatSummaryData> $chats */
    public function chats(array $chats): self
    {
        $this->chats = $chats;

        return $this;
    }

    public function canCreateChats(bool $canCreateChats): self
    {
        $this->canCreateChats = $canCreateChats;

        return $this;
    }

    public function selectedInboxId(string|Optional $selectedInboxId): self
    {
        $this->selectedInboxId = $selectedInboxId;

        return $this;
    }

    public function noAccounts(LayoutPartData|Optional $noAccounts): self
    {
        $this->noAccounts = $noAccounts;

        return $this;
    }

    public function nextAgents(AgentPageCursorData|null $nextAgents): self
    {
        $this->nextAgents = $nextAgents;

        return $this;
    }

    /**
     * @template T of ChatData|ChatWindowData
     * @param class-string<T> $type
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
