<?php

declare(strict_types=1);

namespace Domain\Chat\Models;

use App\Concerns\BoundedReads;
use App\Contracts\ReadableModel;
use App\Models\Support\BelongsToOneActor;
use App\Support\ActorIdentity;
use Domain\Chat\Models\Concerns\PlacedInConversation;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * One emoji a user or agent reacted with to one message in a chat, theirs alone: reacting again with the same emoji
 * takes it back.
 *
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $inbox_id
 * @property string $message_id
 * @property string $emoji
 */
#[Fillable(['inbox_id', 'message_id', 'emoji'])]
final class MessageReaction extends Model implements ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasUlids;
    use PlacedInConversation;

    /**
     * The most reactions a page of messages reads, every emoji of every reader counted once.
     */
    public const int READ_LIMIT = 500;

    // ----------[ Queries ]----------

    /**
     * The reactions to these messages, oldest first, at most the read limit.
     *
     * @param  list<string>  $messageIds
     * @return list<self>
     */
    public static function toMessages(array $messageIds): array
    {
        if ($messageIds === []) {
            return [];
        }

        return array_values(self::query()
            ->whereIn('message_id', $messageIds)
            ->oldest()
            ->readUpTo(self::READ_LIMIT)
            ->get()
            ->all());
    }

    // ----------[ Mutations ]----------

    /**
     * Adds the owner's reaction with this emoji, or takes it back when the owner already reacted with it; answers
     * whether it is there now.
     */
    public static function toggleFor(ActorIdentity $owner, string $inboxId, string $messageId, string $emoji): bool
    {
        $existing = self::query()
            ->ownedBy($owner)
            ->inConversation($inboxId)
            ->where('message_id', $messageId)
            ->where('emoji', $emoji)
            ->first();

        if ($existing !== null) {
            $existing->delete();

            return false;
        }

        $reaction = new self(['inbox_id' => $inboxId, 'message_id' => $messageId, 'emoji' => $emoji]);
        $reaction->belongTo($owner);
        $reaction->save();

        return true;
    }
}
