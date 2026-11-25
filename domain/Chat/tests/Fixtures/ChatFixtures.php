<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Fixtures;

use App\Models\Inboxes\Inbox;
use App\Models\Messages\Message;
use Domain\Chat\Commands\PinMessage\PinMessageCommand;
use Domain\Chat\Models\MessagePin;
use PHPUnit\Framework\Assert;
use Tests\Support\Seeding\JournalSeed;

/**
 * The pins members put on chat messages, arranged through the Chat command so its membership and same-inbox checks
 * hold, and asserted for one member at a time.
 */
final readonly class ChatFixtures
{
    public function __construct(private JournalSeed $journal) {}

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
