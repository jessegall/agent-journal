<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Windows;

use App\Models\Inboxes\Inbox;
use App\Models\Messages\Message;
use App\Reads\PageFormRequests;
use App\Sessions\Contracts\AgentDirectory;
use App\Support\ActorReference;
use App\Support\AgentOption;
use App\Support\Layout\LayoutRowData;
use App\Web\Creation\Contracts\WindowBuilder;
use App\Web\Creation\SurfaceAttributeMap;
use App\Web\Creation\SurfaceContexts;
use App\Web\Values\PaneExcerpt;
use Domain\Chat\Data\ConversationPaneData;
use Domain\Chat\Http\Requests\ConversationRequest;
use Domain\Chat\Models\ChatMessage;
use Domain\Chat\Support\PairChats;
use Illuminate\Http\Request;

final readonly class ConversationWindowBuilder implements WindowBuilder
{
    public function __construct(
        private AgentDirectory $agents,
        private PairChats $chats,
        private PageFormRequests $requests,
        private SurfaceContexts $contexts,
        private SurfaceAttributeMap $policies,
    ) {}

    public function build(Request $visit): ConversationPaneData
    {
        $input = $this->requests->from(ConversationRequest::class, $visit);
        $inbox = $input->chosenInbox();

        if ($inbox->isDefined()) {
            $chosen = $this->chats->attached($inbox->get());

            return $this->preview($chosen, ['inbox' => $chosen->id]);
        }

        $context = $this->contexts->forVisit($visit);
        $session = $context->chosenSessionTarget('session');
        $caller = $context->session() === null ? null : $context->activeAgent();
        $agent = $context->chosenAgent('read') ?? $context->chosenAgent('agent')
            ?? $this->defaultAgent($session?->agentId ?? $caller?->id);

        if ($agent === null) {
            return ConversationPaneData::build()
                ->label('No conversation selected')
                ->items([])
                ->fullUrl(route('chat.conversation', absolute: false))
                ->finish();
        }

        $pair = $this->chats->pairWith(ActorReference::forAgent($agent->agentId));

        return $this->preview(Inbox::query()->findOrFail($pair), ['agent' => $agent->agentId]);
    }

    private function defaultAgent(string|null $agentId): AgentOption|null
    {
        if ($agentId !== null) {
            return $this->agents->visibleAgent($agentId);
        }

        return $this->agents->mainAgentId()->map($this->agents->visibleAgent(...))->getOrElse(null);
    }

    /** @param array<string, string> $query */
    private function preview(Inbox $inbox, array $query): ConversationPaneData
    {
        $policy = $this->policies->forType(ConversationPaneData::class);
        $messages = ChatMessage::previewOf($inbox, $policy->limitFor('items'));
        $items = [];

        foreach ($messages as $entry) {
            $message = $entry->source;

            if ($message instanceof Message) {
                $items[] = LayoutRowData::build()
                    ->key($entry->id)
                    ->label(PaneExcerpt::of($message->body))
                    ->finish();
            }
        }

        return ConversationPaneData::build()
            ->label($inbox->label)
            ->items($items)
            ->fullUrl(route('chat.conversation', $query, false))
            ->finish();
    }
}
