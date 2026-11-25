<?php

declare(strict_types=1);

namespace Domain\Chat\Models;

use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\AuthoredModel;
use App\Enums\ActorType;
use App\Exceptions\InboxUnavailable;
use App\Models\Messages\Message;
use App\Models\Questions\Question;
use App\Models\Support\Accessor;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Domain\Chat\Enums\ChatMessageType;
use Domain\Chat\Events\ChatMessageChanged;
use Domain\Chat\Support\ChatGrouping;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $inbox_id
 * @property string $source_type
 * @property string $source_id
 * @property ChatMessageType $type
 * @property int $group_number
 * @property string $author_type
 * @property string $author_id
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property mixed $author attribute
 * @property Model $source
 */
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
    public static function create(
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

        $author = $source->author();
        $latest = self::lockNewestInInbox($inboxId);

        $entry = new self();
        $entry->inbox_id = $inboxId;
        $entry->source_type = $source->getMorphClass();
        $entry->source_id = $source->getKey();
        $entry->type = $type;
        $entry->group_number = self::groupAfter($latest, $author, $at);
        $entry->author_type = $author->type->value;
        $entry->author_id = $author->id;
        $entry->assertSaved($entry->save());

        $entry->raise(new ChatMessageChanged($inboxId, $entry->id));

        return $entry;
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

    // ----------[ Accessors ]----------

    /**
     * The actor who made the entry's source.
     *
     * @return Attribute<ActorIdentity, never>
     */
    protected function author(): Attribute
    {
        return Accessor::get(fn () => new ActorIdentity(ActorType::from($this->author_type), $this->author_id));
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
        return self::query()->forSourceKey(Message::linkType(), $messageId)->first();
    }

    /**
     * The card that shows the question, or none while it is not recorded yet.
     */
    public static function findForQuestion(string $questionId): self|null
    {
        return self::query()->forSourceKey(Question::linkType(), $questionId)->first();
    }

    /**
     * The event that shows the record, or none while it is not recorded yet.
     */
    public static function findForEvent(AuthoredModel $record): self|null
    {
        return self::query()->forSource($record)->ofType(ChatMessageType::Event)->first();
    }

    /**
     * The inbox's newest entry, locked so the next entry's group is worked out from it alone; none in an empty inbox.
     */
    public static function lockNewestInInbox(string $inboxId): self|null
    {
        return self::query()->newestInInbox($inboxId)->lockForUpdate()->first();
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
     * The entries of the type.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofType(Builder $query, ChatMessageType $type): void
    {
        $query->where('type', $type);
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

    /**
     * The rows of the given inbox.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofInbox(Builder $query, string $inboxId): void
    {
        $query->where('inbox_id', $inboxId);
    }

    /**
     * The rows with their source loaded.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withSource(Builder $query): void
    {
        $query->with('source');
    }
}
