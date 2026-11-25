<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Feature;

use App\Exceptions\MessageMissing;
use Domain\Chat\Commands\PinMessage\PinMessageCommand;
use Domain\Chat\Models\MessagePin;
use Domain\Chat\Resolvers\Support\MessagePinRecords;
use Domain\Chat\Tests\Support\OpensTeamDeskMessage;
use Domain\Chat\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsKeyedCommands;
use Tests\Support\StartsAgentRequests;
use Tests\Support\WritesInboxMessages;

/**
 * A pin is its owner's alone, one per message and inbox, made only on a message the owner can read, and
 * listed only while the owner still can: it hides when access goes and comes back with it.
 */
final class MessagePinTest extends TestCase
{
    use CommitsHookRows;
    use OpensTeamDeskMessage;
    use RunsKeyedCommands;
    use StartsAgentRequests;
    use WritesInboxMessages;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
        'command_receipts',
        'messages',
        'message_attentions',
        'message_pins',
    ];

    public function test_pinning_twice_keeps_one_pin_and_leaves_other_pins_alone(): void
    {
        $this->asAgent($this->builder);
        $this->pin();
        $this->pin();

        $this->assertSame(1, MessagePin::query()->withoutGlobalScopes()->count());
        $this->assertSame([$this->messageId], array_column($this->pinned(), 'id'));

        $this->asAgent($this->reviewer);
        $this->assertSame([], $this->pinned());
    }

    public function test_a_message_the_asker_cannot_read_is_refused(): void
    {
        $this->asAgent($this->reviewer);

        $this->expectException(MessageMissing::class);

        $this->pin();
    }

    public function test_a_pin_hides_while_access_is_gone_and_returns_with_it(): void
    {
        $this->asAgent($this->builder);
        $this->pin();

        $this->replaceOccupant($this->reviewer[0]);
        $this->asAgent($this->builder);
        $this->assertSame([], $this->pinned());

        $this->replaceOccupant($this->builder[0]);
        $this->asAgent($this->builder);
        $this->assertSame([$this->messageId], array_column($this->pinned(), 'id'));
    }

    private function pin(): void
    {
        $this->runOnBus(new PinMessageCommand($this->desk->inboxId(), $this->messageId));
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function pinned(): array
    {
        return array_map(fn ($view) => $view->toArray(), $this->app->make(MessagePinRecords::class)->pinned());
    }
}
