<?php

declare(strict_types=1);

namespace Domain\Chat\Models;

use App\Contracts\Records\AuthoredModel;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Exceptions\InboxUnavailable;
use App\Models\Messages\Message;
use App\Models\Questions\Question;
use App\Enums\ActorType;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Domain\Chat\Enums\ChatMessageType;
use Domain\Chat\Events\ChatMessageChanged;
use Domain\Chat\Support\ChatGrouping;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * One entry of an inbox's chat and what it shows: its source, a message, a question or the record of something that
 * happened. It holds no text of its own. Entries of one author close together share a group.
 *
 * @property string $id
 * @property string $inbox_id
 * @property string $source_type
 * @property string $source_id
 * @property ChatMessageType $type
 * @property int $group_number
 * @property string $author_type
 * @property string $author_id
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 * @property Model $source
 */
#[Fillable(['inbox_id', 'source_type', 'source_id', 'type', 'group_number', 'author_type', 'author_id'])]
final class ChatMessage extends Model implements EventSource
{
    use HasUlids;
    use RaisesEvents;

    public const int PAGE_SIZE = 50;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => ChatMessageType::class,
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * Records the source in the inbox's chat once; a replay finds the entry it made, and a replay that names another
     * inbox is refused. The entry joins its author's open group, or opens the next one.
     *
     * @throws InboxUnavailable
     */
    public static function record(
        string $inboxId,
        AuthoredModel $source,
        ChatMessageType $type,
        CarbonImmutable $at,
    ): self {
        $existing = self::findForSource($source);

        if ($existing !== null) {
            $existing->assertInInbox($inboxId);

            return $existing;
        }

        $latest = self::query()->newestInInbox($inboxId)->lockForUpdate()->first();
        $author = $source->author();
        $entry = self::query()->create([
            'inbox_id' => $inboxId,
            'source_type' => $source->getMorphClass(),
            'source_id' => $source->getKey(),
            'type' => $type,
            'group_number' => self::groupAfter($latest, $author, $at),
            'author_type' => $author->type->value,
            'author_id' => $author->id,
        ]);

        $entry->raise(new ChatMessageChanged($inboxId, $entry->id));

        return $entry;
    }

    // ----------[ Queries ]----------

    /**
     * The entry that shows the source, or none while it is not recorded yet.
     */
    public static function findForSource(AuthoredModel $source): self|null
    {
        return self::query()->forSource($source)->first();
    }

    /**
     * The entry that shows the message, or none while it is not recorded yet.
     */
    public static function findForMessage(string $messageId): self|null
    {
        return self::query()->forSourceKey(Message::LINK_TYPE, $messageId)->first();
    }

    /**
     * The card that shows the question, or none while it is not recorded yet.
     */
    public static function findForQuestion(string $questionId): self|null
    {
        return self::query()->forSourceKey(Question::LINK_TYPE, $questionId)->first();
    }

    /**
     * The event that shows the record, or none while it is not recorded yet.
     */
    public static function findForEvent(AuthoredModel $record): self|null
    {
        return self::query()->forSource($record)->where('type', ChatMessageType::Event)->first();
    }

    // ----------[ Mutations ]----------

    /**
     * The source changed what it shows, such as a question that was answered; the entry keeps its place.
     */
    public function reload(): void
    {
        $this->touch();

        $this->raise(new ChatMessageChanged($this->inbox_id, $this->id));
    }

    // ----------[ Answers ]----------

    /**
     * The actor who made the entry's source.
     */
    public function author(): ActorIdentity
    {
        return new ActorIdentity(ActorType::from($this->author_type), $this->author_id);
    }

    // ----------[ Relations ]----------

    /**
     * @return MorphTo<Model, $this>
     */
    public function source(): MorphTo
    {
        return $this->morphTo();
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses a replay that names another inbox than the one the entry was recorded in.
     *
     * @throws InboxUnavailable
     */
    private function assertInInbox(string $inboxId): void
    {
        if ($this->inbox_id !== $inboxId) {
            throw InboxUnavailable::forId($inboxId);
        }
    }

    // ----------[ Internals ]----------

    /**
     * The group of the next entry: the latest group while it is the same author's and within the window, else the next.
     */
    private static function groupAfter(self|null $latest, ActorIdentity $author, CarbonImmutable $at): int
    {
        if ($latest === null) {
            return 1;
        }

        if ($latest->isSameAuthor($author) && $latest->isWithinGroupWindow($at)) {
            return $latest->group_number;
        }

        return $latest->group_number + 1;
    }

    /**
     * Whether the entry was written by the author.
     */
    private function isSameAuthor(ActorIdentity $author): bool
    {
        return $this->author_type === $author->type->value && $this->author_id === $author->id;
    }

    /**
     * Whether a later entry at that time still joins this entry's group.
     */
    private function isWithinGroupWindow(CarbonImmutable $at): bool
    {
        return $this->created_at->diffInSeconds($at) <= ChatGrouping::WINDOW_SECONDS;
    }

    // ----------[ Scopes ]----------

    /**
     * The inbox's entries, newest first.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function newestInInbox(Builder $query, string $inboxId): void
    {
        $query->where('inbox_id', $inboxId)->latest('created_at')->latest('id');
    }

    /**
     * The entry that shows the source.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forSource(Builder $query, AuthoredModel $source): void
    {
        $query->forSourceKey($source->getMorphClass(), (string) $source->getKey());
    }

    /**
     * The entry that shows the source of that alias and key.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forSourceKey(Builder $query, string $sourceType, string $sourceId): void
    {
        $query->where('source_type', $sourceType)->where('source_id', $sourceId);
    }

    /**
     * The inbox's entries before the cursor entry, newest first; the first page without one.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function pageBefore(Builder $query, string $inboxId, self|null $cursor): void
    {
        $query->where('inbox_id', $inboxId)
            ->when($cursor !== null, fn (Builder $older) => $older->where(fn (Builder $before) => $before
                ->where('created_at', '<', $cursor->created_at)
                ->orWhere(fn (Builder $tied) => $tied
                    ->where('created_at', $cursor->created_at)
                    ->where('id', '<', $cursor->id))))
            ->orderByDesc('created_at')
            ->orderByDesc('id');
    }
}
