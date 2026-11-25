<?php

declare(strict_types=1);

namespace Domain\Chat\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Models\Support\BelongsToOneActor;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $inbox_id
 * @property string $message_id
 * @property CarbonImmutable $pinned_at
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 */
final class MessagePin extends Model implements ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public const int DEFAULT_LIMIT = 50;

    public const int LARGEST_LIMIT = 100;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['pinned_at' => 'immutable_datetime'];
    }

    // ----------[ Constructors ]----------

    /**
     * Pins the message in the conversation for the owner; pinning it again keeps the one pin.
     */
    public static function create(
        ActorIdentity $owner,
        string $inboxId,
        string $messageId,
    ): self {
        $existing = self::query()
            ->ownedBy($owner)
            ->ofMessage($inboxId, $messageId)
            ->first();

        if ($existing !== null) {
            return $existing;
        }

        $pin = new self();
        $pin->inbox_id = $inboxId;
        $pin->message_id = $messageId;
        $pin->pinned_at = CarbonImmutable::now();

        $pin->belongTo($owner);
        $pin->save();

        return $pin;
    }

    // ----------[ Scopes ]----------

    /**
     * The pins of the inbox's message.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofMessage(Builder $query, string $inboxId, string $messageId): void
    {
        $query->where('inbox_id', $inboxId)->where('message_id', $messageId);
    }

    /**
     * The rows by pinned at descending, then id descending.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function newestPinnedFirst(Builder $query): void
    {
        $query->orderByDesc('pinned_at');
        $query->orderByDesc('id');
    }
}
