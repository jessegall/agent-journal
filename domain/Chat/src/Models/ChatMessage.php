<?php

declare(strict_types=1);

namespace Domain\Chat\Models;

use App\Models\Messages\Message;
use Carbon\CarbonImmutable;
use Domain\Chat\Enums\ChatMessageType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One entry of a chat and what it is there: a message it shows, or an entry of the chat's own such as a mark. It holds
 * no text of its own.
 *
 * @property string $id
 * @property string|null $message_id
 * @property ChatMessageType $type
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 */
#[Fillable(['message_id', 'type'])]
final class ChatMessage extends Model
{
    use HasUlids;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['type' => ChatMessageType::class];
    }

    /**
     * Records that the chat shows the message as the type given.
     */
    public static function record(string $messageId, ChatMessageType $type): self
    {
        return self::query()->create(['message_id' => $messageId, 'type' => $type]);
    }

    /**
     * The message this chat message shows.
     *
     * @return BelongsTo<Message, $this>
     */
    public function message(): BelongsTo
    {
        return $this->belongsTo(Message::class);
    }
}
