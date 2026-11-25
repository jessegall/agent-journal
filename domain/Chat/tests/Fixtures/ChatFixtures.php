<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Fixtures;

use App\Models\Inboxes\Inbox;
use App\Models\Messages\Message;
use App\Support\ActorReference;
use Domain\Chat\Commands\PinMessage\PinMessageCommand;
use Domain\Chat\Models\MessagePin;
use Domain\Chat\Support\PairChats;
use PHPUnit\Framework\Assert;
use Tests\Support\Seeding\FixtureInboxes;
use Tests\Support\Seeding\TestJournal;

/**
 * Pair chats of two actors as the chat page opens them, and the pins members put on chat messages, arranged through
 * the Chat command so its membership and same-inbox checks hold, and asserted for one member at a time.
 */
final readonly class ChatFixtures
{
    public function __construct(private TestJournal $journal) {}

    /**
     * The pair chat of the two actors, both attached, as the chat page opens it between them.
     */
    public function pairChat(ActorReference $first, ActorReference $second): Inbox
    {
        return $this->journal->inboxes()->shared($first, $second, PairChats::PAIR_PROVIDER);
    }

    /**
     * The pair chat of the two users or agents of these names, both attached.
     */
    public function pairChatBetween(string $first, string $second): self
    {
        $this->pairChat($this->journal->actorCalled($first), $this->journal->actorCalled($second));

        return $this;
    }

    public function pairChatOf(string $first, string $second): Inbox
    {
        $key = FixtureInboxes::pairKey($this->journal->actorCalled($first), $this->journal->actorCalled($second));

        return Inbox::query()->withProviderKey(PairChats::PAIR_PROVIDER)->ofProvider($key)->sole();
    }

    /**
     * The named member pins the message in the inbox.
     */
    public function pin(Inbox $inbox, Message $message, string $member): self
    {
        $this->journal->runAs($member, new PinMessageCommand($inbox->id, $message->id));

        return $this;
    }

    public function pinOf(Inbox $inbox, Message $message, string $member): MessagePin|null
    {
        return MessagePin::findOwnedOfMessage($this->journal->actorCalled($member), $inbox->id, $message->id);
    }

    public function assertPinned(Inbox $inbox, Message $message, string $member): self
    {
        Assert::assertNotNull($this->pinOf($inbox, $message, $member), "{$member} has not pinned the message.");

        return $this;
    }

    public function assertUnpinned(Inbox $inbox, Message $message, string $member): self
    {
        Assert::assertNull($this->pinOf($inbox, $message, $member), "{$member} still has the message pinned.");

        return $this;
    }
}
