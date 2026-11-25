<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Fixtures;

use Domain\Chat\Commands\UnpinMessage\UnpinMessageCommand;
use Domain\Chat\Tests\TestCase;
use Tests\Support\RefreshHookDatabase;

/**
 * Pins arranged through the journal belong to one member: taking away one's own pin leaves another member's, and the
 * message stays in its inbox.
 */
final class ChatFixturesTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_member_takes_away_only_their_own_pin_and_the_message_stays(): void
    {
        $chat = $this->journal->owner()->agent('Planner')->chat('Owner', 'Planner')->chatOf('Owner', 'Planner');
        $message = $this->journal->post('Planner', $chat, 'Keep this.');

        $pins = $this->journal->fixtures(ChatFixtures::class)
            ->pin($chat, $message, 'Owner')
            ->pin($chat, $message, 'Planner');

        $this->journal->runAs('Owner', new UnpinMessageCommand($chat->id, $message->id));

        $pins->assertUnpinned($chat, $message, 'Owner')->assertPinned($chat, $message, 'Planner');
        $this->journal->assertMessageSent($chat, 'Planner', 'Keep this.');
    }
}
