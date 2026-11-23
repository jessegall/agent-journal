<?php

declare(strict_types=1);

namespace Domain\Chat\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Models\Support\BelongsToOneActor;
use App\Support\ActorIdentity;
use Domain\Chat\Events\MessageReactionAdded;
use Domain\Chat\Models\Concerns\PlacedInConversation;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * One emoji a user or agent reacted with to one message in a chat, theirs alone.
 *
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $inbox_id
 * @property string $message_id
 * @property string $emoji
 */
#[Fillable(['inbox_id', 'message_id', 'emoji'])]
final class MessageReaction extends Model implements EventSource, ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use PlacedInConversation;
    use RaisesEvents;

    /**
     * The most reactions a page of messages reads, every emoji of every reader counted once.
     */
    public const int READ_LIMIT = 500;

    // ----------[ Queries ]----------

    /**
     * The reactions to these messages, oldest first, at most the read limit.
     *
     * @param  list<string>  $ids
     * @return list<self>
     */
    public static function toMessages(array $ids): array
    {
        if ($ids === []) {
            return [];
        }

        return array_values(self::query()
            ->whereIn('message_id', $ids)
            ->oldest()
            ->readUpTo(self::READ_LIMIT)
            ->get()
            ->all());
    }

    /**
     * The owner's reaction with this emoji to the message, when it reacted with it.
     */
    public static function findFor(ActorIdentity $owner, string $inboxId, string $messageId, string $emoji): self|null
    {
        return self::query()
            ->ownedBy($owner)
            ->inConversation($inboxId)
            ->where('message_id', $messageId)
            ->where('emoji', $emoji)
            ->first();
    }

    // ----------[ Mutations ]----------

    /**
     * The owner's new reaction with this emoji to the message.
     */
    public static function create(ActorIdentity $owner, string $inboxId, string $messageId, string $emoji): self
    {
        $reaction = new self(['inbox_id' => $inboxId, 'message_id' => $messageId, 'emoji' => $emoji]);
        $reaction->belongTo($owner);
        $reaction->save();
        $reaction->raise(new MessageReactionAdded($inboxId, $messageId, $owner));

        return $reaction;
    }

    /**
     * Takes this reaction back.
     */
    public function withdraw(): void
    {
        $this->delete();
    }
}
