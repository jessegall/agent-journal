<?php

declare(strict_types=1);

namespace Domain\Chat\Models;

use App\Contracts\Support\InsertsAbsentRows;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Domain\Chat\Exceptions\ConversationUnavailable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Support\Str;

/**
 * One conversation between two inboxes, the pivot that pairs them, the same row whichever side names it first: what its docked sources are
 * shared in.
 *
 * @property string $id
 * @property string $low_inbox_id
 * @property string $high_inbox_id
 */
#[Fillable(['id', 'low_inbox_id', 'high_inbox_id'])]
final class Conversation extends Pivot implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use InsertsAbsentRows;
    use Linkable;

    protected $table = 'conversations';

    protected $guarded = ['*'];

    // ----------[ Constructors ]----------

    /**
     * The conversation between the two inboxes, made the first time and locked, in either order of the two.
     */
    public static function between(string $firstInboxId, string $secondInboxId): self
    {
        [$low, $high] = self::ordered($firstInboxId, $secondInboxId);

        $conversation = new self([
            'id' => strtolower((string) Str::ulid()),
            'low_inbox_id' => $low,
            'high_inbox_id' => $high,
        ]);

        $conversation->insertIfAbsent();

        return self::query()
            ->where('low_inbox_id', $low)
            ->where('high_inbox_id', $high)
            ->lockForUpdate()
            ->firstOrFail();
    }

    // ----------[ Queries ]----------

    /**
     * The conversation between the two inboxes, once one was made.
     */
    public static function existingBetween(string $firstInboxId, string $secondInboxId): self|null
    {
        [$low, $high] = self::ordered($firstInboxId, $secondInboxId);

        return self::query()->where('low_inbox_id', $low)->where('high_inbox_id', $high)->first();
    }

    /**
     * The conversation under its row lock, for a dock change that must happen once.
     *
     * @throws ConversationUnavailable
     */
    public static function lockedById(string $id): self
    {
        return self::query()
            ->whereKey($id)
            ->lockForUpdate()
            ->firstOr(fn () => throw ConversationUnavailable::missing($id));
    }

    // ----------[ Answers ]----------

    /**
     * Whether the inbox is one side of this conversation.
     */
    public function joins(string $inboxId): bool
    {
        return $this->low_inbox_id === $inboxId || $this->high_inbox_id === $inboxId;
    }

    /**
     * The other side of the conversation from one of its inboxes.
     */
    public function peerOf(string $inboxId): string
    {
        return $this->low_inbox_id === $inboxId ? $this->high_inbox_id : $this->low_inbox_id;
    }

    // ----------[ Relations ]----------

    /**
     * @return HasMany<DockPlacement, $this>
     */
    public function placements(): HasMany
    {
        return $this->hasMany(DockPlacement::class);
    }

    // ----------[ Internals ]----------

    /**
     * @return array{string, string}
     */
    private static function ordered(string $firstInboxId, string $secondInboxId): array
    {
        return $firstInboxId < $secondInboxId ? [$firstInboxId, $secondInboxId] : [$secondInboxId, $firstInboxId];
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function joinedBy(Builder $query, string $inboxId): void
    {
        $query->where(
            fn (Builder $sides) => $sides->where('low_inbox_id', $inboxId)->orWhere('high_inbox_id', $inboxId),
        );
    }
}
