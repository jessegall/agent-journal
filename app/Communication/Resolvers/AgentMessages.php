<?php

declare(strict_types=1);

namespace App\Communication\Resolvers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\CurrentSession;
use App\Agents\Models\JobMessageSource;
use App\Agents\Models\MessageSelection;
use App\Assignments\Support\NumberedPage;
use App\Communication\Contracts\AgentMessageReader;
use App\Communication\Data\AgentInbox;
use App\Communication\Data\AgentInboxCounts;
use App\Communication\Data\AgentMessageCard;
use App\Communication\Data\AgentMessageDetails;
use App\Communication\Enums\AgentInboxState;
use App\Communication\Enums\AgentMessageView;
use App\Communication\Models\Message;
use App\Communication\Support\RegisteredInboxes;
use App\Mcp\Support\Continuation;
use App\Mcp\Support\Continuations;
use App\Mcp\Support\TextChunk;
use Illuminate\Database\Eloquent\Builder;

final readonly class AgentMessages implements AgentMessageReader
{
    public const string CONTEXT_TOOL = 'messages_context';

    private const int CHUNK_BYTES = 900;

    public function __construct(
        private CurrentActor $actors,
        private CurrentSession $session,
        private RegisteredInboxes $inboxes,
        private Continuations $continuations,
    ) {}

    public function inbox(AgentInboxState $state, int $page): AgentInbox
    {
        $numbered = new NumberedPage($page);
        $incoming = $state->apply($this->incoming());
        $total = (clone $incoming)->count();
        $messages = $incoming->orderByDesc('created_at')->orderByDesc('id')
            ->offset(($numbered->number - 1) * $numbered->size)
            ->readLimit($numbered->size)->get();
        $selected = $this->selected();
        $source = $this->source();

        return new AgentInbox(
            array_values($messages->map(fn (Message $message) => $this->card($message, $selected, $source))->all()),
            $numbered,
            $total,
        );
    }

    public function counts(): AgentInboxCounts
    {
        return new AgentInboxCounts(
            $this->incoming()->whereNull('read_at')->count(),
            AgentInboxState::Pending->apply($this->incoming())->count(),
        );
    }

    public function message(string $messageId, AgentMessageView $view): AgentMessageDetails
    {
        if ($view === AgentMessageView::Context) {
            return $this->context($messageId, null);
        }

        $message = Message::visibleById($messageId);

        return new AgentMessageDetails($this->card($message, $this->selected(), $this->source()));
    }

    public function context(string $messageId, string|null $continuation): AgentMessageDetails
    {
        $root = Message::visibleById($messageId);
        $position = $continuation === null
            ? new Continuation(self::CONTEXT_TOOL, $messageId, ['message_id' => $messageId], 1)
            : $this->continuations->open($continuation, self::CONTEXT_TOOL, $messageId);
        $currentId = (string) $position->filters['message_id'];
        $message = $currentId === $root->id ? $root : Message::visibleById($currentId);
        $position->requireRevision($message->revision());
        $body = TextChunk::of($message->body, $position->offset, $position->characterOffset, self::CHUNK_BYTES);

        return new AgentMessageDetails(
            $this->card($message, $this->selected(), $this->source()),
            $body,
            $this->next($position, $message, $body),
        );
    }

    private function next(Continuation $position, Message $message, TextChunk $body): string|null
    {
        if ($body->hasMore) {
            return $this->continuations->issue(new Continuation(
                self::CONTEXT_TOOL, $position->selector, $position->filters,
                $body->nextLine, $body->nextCharacter, $message->revision(),
            ));
        }

        if ($message->reply_to_id === null) {
            return null;
        }

        return $this->continuations->issue(new Continuation(
            self::CONTEXT_TOOL, $position->selector, ['message_id' => $message->reply_to_id], 1,
        ));
    }

    /** @return Builder<Message> */
    private function incoming(): Builder
    {
        $actor = ActorIdentity::of($this->actors->actor());

        return Message::query()->whereIn('destination_inbox_id', $this->inboxes->inboxIdsOf($actor));
    }

    private function selected(): string|null
    {
        return $this->session->hasSession() ? MessageSelection::messageFor($this->session->sessionId()) : null;
    }

    private function source(): string|null
    {
        return $this->session->hasSession() ? JobMessageSource::messageFor($this->session->sessionId()) : null;
    }

    private function card(Message $message, string|null $selected, string|null $source): AgentMessageCard
    {
        return new AgentMessageCard(
            $message->id,
            $message->number,
            $message->firstLine(),
            $message->author(),
            $message->source_inbox_id,
            $message->destination_inbox_id,
            $message->state,
            $message->revision(),
            $message->is_question,
            $message->read_at === null,
            $message->id === $selected,
            $message->id === $source,
            $message->reply_to_id,
            $message->answer_message_id,
            $message->dismissal_reason,
        );
    }
}
