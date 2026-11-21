<?php

declare(strict_types=1);

namespace Domain\Chat\Models;

use App\Actors\Models\Support\BelongsToOneActor;
use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Domain\Chat\Models\Concerns\PlacedInConversation;
use Domain\Chat\Support\ConversationPair;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * One message a user or agent pinned in one conversation, its own and nobody else's: a seat change never moves it.
 *
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $source_inbox_id
 * @property string $destination_inbox_id
 * @property string $message_id
 * @property CarbonImmutable $pinned_at
 */
#[Fillable(['source_inbox_id', 'destination_inbox_id', 'message_id', 'pinned_at'])]
final class MessagePin extends Model implements ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use PlacedInConversation;

    public const int DEFAULT_LIMIT = 50;

    public const int LARGEST_LIMIT = 100;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['pinned_at' => 'immutable_datetime'];
    }

    /**
     * Pins the message in the conversation for the owner; pinning it again keeps the one pin.
     */
    public static function pinFor(
        ActorIdentity $owner,
        ConversationPair $conversation,
        string $messageId,
    ): self {
        $existing = self::query()
            ->ownedBy($owner)
            ->inConversation($conversation)
            ->where('message_id', $messageId)
            ->first();

        if ($existing !== null) {
            return $existing;
        }

        $pin = new self([
            'source_inbox_id' => $conversation->sourceInboxId,
            'destination_inbox_id' => $conversation->destinationInboxId,
            'message_id' => $messageId,
            'pinned_at' => CarbonImmutable::now(),
        ]);

        $pin->belongTo($owner);
        $pin->save();

        return $pin;
    }

    // ----------[ Queries ]----------

}
