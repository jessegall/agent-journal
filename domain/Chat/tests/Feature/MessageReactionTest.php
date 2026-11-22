<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Feature;

use App\Exceptions\MessageMissing;
use Domain\Chat\Commands\ToggleReaction\ToggleReactionCommand;
use Domain\Chat\Models\MessageReaction;
use Domain\Chat\Tests\Support\OpensTeamDeskMessage;
use Domain\Chat\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsKeyedCommands;
use Tests\Support\StartsAgentRequests;
use Tests\Support\WritesInboxMessages;

/**
 * A reaction is added by its first toggle and taken back by the second, only on a message the asker may read.
 */
final class MessageReactionTest extends TestCase
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
        'start_tokens',
        'agent_stacks',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
        'command_receipts',
        'messages',
        'message_attentions',
        'message_reactions',
    ];

    public function test_a_second_toggle_takes_the_reaction_back(): void
    {
        $this->asAgent($this->builder);

        $this->assertTrue($this->react('👍'));
        $this->assertSame(1, MessageReaction::query()->withoutGlobalScopes()->count());

        $this->assertFalse($this->react('👍'));
        $this->assertSame(0, MessageReaction::query()->withoutGlobalScopes()->count());
    }

    public function test_a_message_the_asker_cannot_read_is_refused(): void
    {
        $this->asAgent($this->reviewer);

        $this->expectException(MessageMissing::class);

        $this->react('👍');
    }

    private function react(string $emoji): mixed
    {
        return $this->runOnBus(new ToggleReactionCommand($this->desk->inboxId(), $this->messageId, $emoji));
    }
}
