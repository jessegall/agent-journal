<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Commands;

use App\Exceptions\MessageMissing;
use App\Models\Messages\Message;
use Domain\Chat\Commands\PinMessage\PinMessageCommand;
use Domain\Chat\Commands\UnpinMessage\UnpinMessageCommand;
use Domain\Chat\Models\MessagePin;
use Domain\Chat\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\Seeding\SeedsJournal;

/**
 * A member takes away their own pin of a message and leaves another member's; a message outside the inbox is refused.
 */
final class UnpinMessageTest extends TestCase
{
    use CommitsHookRows;
    use SeedsJournal;

    private const array TABLES = ['messages', 'message_pins'];

    private string $chatId;

    private Message $message;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal()->owner()->agent('Planner')->chat('Owner', 'Planner');
        $this->chatId = $this->journal()->chatOf('Owner', 'Planner')->id;
        $this->message = $this->journal()->post('Planner', $this->journal()->chatOf('Owner', 'Planner'), 'Keep this.');
    }

    public function test_a_member_takes_away_their_own_pin_and_leaves_the_others(): void
    {
        $this->journal()->run(new PinMessageCommand($this->chatId, $this->message->id));
        $this->journal()->actAs('Planner')->run(new PinMessageCommand($this->chatId, $this->message->id));

        $this->journal()->actAs('Owner')->run(new UnpinMessageCommand($this->chatId, $this->message->id));

        $this->assertSame(
            [$this->journal()->agentCalled('Planner')->id],
            MessagePin::query()->withoutGlobalScopes()->pluck('actor_id')->all(),
        );
    }

    public function test_a_message_outside_the_inbox_is_refused(): void
    {
        $own = $this->journal()->inboxCalled('Owner');
        $elsewhere = $this->journal()->post('Owner', $own, 'Mine.');

        $this->assertThrows(
            fn () => $this->journal()->run(new UnpinMessageCommand($this->chatId, $elsewhere->id)),
            MessageMissing::class,
        );
    }
}
