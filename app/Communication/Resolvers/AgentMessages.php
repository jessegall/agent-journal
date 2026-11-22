<?php

declare(strict_types=1);

namespace App\Communication\Resolvers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\CurrentSession;
use App\Agents\Models\AgentSession;
use App\Assignments\Support\NumberedPage;
use App\Communication\Contracts\AgentMessageReader;
use App\Communication\Data\AgentChatPart;
use App\Communication\Data\AgentInbox;
use App\Communication\Data\AgentInboxCounts;
use App\Communication\Data\AgentMessageCard;
use App\Communication\Data\AgentMessageDetails;
use App\Communication\Enums\AgentInboxState;
use App\Communication\Models\Message;
use App\Communication\Models\SpeechOpportunity;
use App\Communication\Support\RegisteredInboxes;
use App\Mcp\Contracts\Continuations;
use App\Mcp\Contracts\SearchContribution;
use App\Mcp\Data\SearchHit;
use App\Mcp\Data\SearchPage;
use App\Mcp\Support\Continuation;
use App\Mcp\Support\TextChunk;
use App\Reads\Enums\ReadView;
use App\Reads\Support\ReadBuilder;
use Illuminate\Database\Eloquent\Builder;

final readonly class AgentMessages implements AgentMessageReader
{
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
        $reader = ActorIdentity::of($this->actors->actor());
        $incoming = $this->incoming()->where(fn (Builder $messages) => $messages->forInboxState($state, $reader));
        $total = (clone $incoming)->count();

        $messages = $incoming->orderByDesc('created_at')->orderByDesc('id')
            ->offset(($numbered->number - 1) * $numbered->size)
            ->readExactly($numbered->size)->get();

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
        $reader = ActorIdentity::of($this->actors->actor());

        return new AgentInboxCounts(
            $this->incoming()->unreadBy($reader)->count(),
            $this->incoming()->pendingFor($reader)->count(),
        );
    }

    public function search(string $query, int $page): SearchPage
    {
        $size = SearchContribution::PAGE_SIZE;

        $matching = Message::query()->matchingBody($query)->orderByDesc('created_at')->orderByDesc('id')
            ->offset(($page - 1) * $size)->readExactly($size + 1)->get();

        $hits = $matching->take($size)->map(fn (Message $message) => SearchHit::matching(
            self::SEARCH_TYPE,
            $message->id,
            "Message {$message->number}",
            $message->body,
            $query,
        ))->all();

        return new SearchPage(array_values($hits), $matching->count() > $size);
    }

    public function message(string $messageId, ReadView $view): AgentMessageDetails
    {
        if ($view === ReadView::Context) {
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
        $position->assertCurrentRevision($message->revision());
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
                self::CONTEXT_TOOL,
                $position->selector,
                $position->filters,
                $body->nextLine,
                $body->nextCharacter,
                $message->revision(),
            ));
        }

        if ($message->reply_to_id === null) {
            return null;
        }

        return $this->continuations->issue(new Continuation(
            self::CONTEXT_TOOL,
            $position->selector,
            ['message_id' => $message->reply_to_id],
            1,
        ));
    }

    /**
     * @return ReadBuilder<Message>
     */
    private function incoming(): ReadBuilder
    {
        $actor = ActorIdentity::of($this->actors->actor());

        return Message::query()->whereIn('destination_inbox_id', $this->inboxes->inboxIdsOf($actor));
    }

    private function selected(): string|null
    {
        return $this->session->hasSession() ? AgentSession::selectedMessage($this->session->sessionId()) : null;
    }

    private function source(): string|null
    {
        return $this->session->hasSession() ? AgentSession::jobSourceMessage($this->session->sessionId()) : null;
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
            $this->isUnread($message),
            $message->id === $selected,
            $message->id === $source,
            $message->reply_to_id,
            $message->answer_message_id,
            $message->dismissal_reason,
            $message->isChat() ? $this->chatPartOf($message) : null,
        );
    }

    /**
     * Desk mail is unread until anyone reads it; a chat row until it was shown to this reader.
     */
    private function isUnread(Message $message): bool
    {
        if (! $message->isChat()) {
            return $message->read_at === null;
        }

        return Message::query()->whereKey($message->id)->unpresentedTo($this->reader())->exists();
    }

    private function chatPartOf(Message $message): AgentChatPart
    {
        $reader = $this->reader();
        $root = $message->user_root_id;
        $isOpen = $root !== null && SpeechOpportunity::query()->onRoot($root)->openFor($reader)->exists();

        return new AgentChatPart($message->destination_inbox_id, $reader, $isOpen ? $root : null);
    }

    private function reader(): ActorIdentity
    {
        return ActorIdentity::of($this->actors->actor());
    }
}
