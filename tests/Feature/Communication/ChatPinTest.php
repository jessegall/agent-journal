<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\Messages\PostChatMessage\PostChatMessageCommand;
use App\Exceptions\MessageMissing;
use App\Support\ActorIdentity;
use Domain\Chat\Commands\PinMessage\PinMessageCommand;
use Domain\Chat\Models\MessagePin;
use Tests\Support\MessagingTestCase;
use Tests\Support\OpensPairChats;

/**
 * A pin names the chat by its inbox and takes only a message the asker sees in that chat.
 */
final class ChatPinTest extends MessagingTestCase
{
    use OpensPairChats;

    public function test_a_chat_message_is_pinned_in_its_own_chat_and_refused_in_another(): void
    {
        $chat = $this->pairChat(ActorIdentity::of($this->owner), $this->actorOf($this->builder));
        $other = $this->pairChat(ActorIdentity::of($this->owner), $this->actorOf($this->reviewer));
        $this->asOwner();
        $messageId = $this->runOnBus(new PostChatMessageCommand($chat->inbox_id, 'Pin this.', 'pin-key'));

        $this->runOnBus(new PinMessageCommand($chat->inbox_id, $messageId));

        $this->assertSame($chat->inbox_id, MessagePin::query()->sole()->inbox_id);
        $this->expectException(MessageMissing::class);
        $this->runOnBus(new PinMessageCommand($other->inbox_id, $messageId));
    }
}
