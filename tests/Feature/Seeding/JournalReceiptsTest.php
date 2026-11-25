<?php

declare(strict_types=1);

namespace Tests\Feature\Seeding;

use App\Commands\Layouts\SaveLayout\SaveLayoutCommand;
use App\Data\Layouts\LayoutShape;
use App\Enums\CommandRules\ReceiptStatus;
use Tests\Commands\Layouts\SaveLayoutTest;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The journal reads the receipt a keyed command left for the actor in place, and another actor sees none of it.
 */
final class JournalReceiptsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_keyed_command_leaves_a_completed_receipt_that_replays_its_reply(): void
    {
        $this->journal->owner();
        $command = new SaveLayoutCommand('Writing', LayoutShape::from(SaveLayoutTest::shape('chat')));
        $reply = $this->journal->run($command, 'key-1');

        $receipt = $this->journal->commandReceipt($command, 'key-1');

        $this->journal->assertReceiptStatus($receipt, ReceiptStatus::Completed)->assertReplayedReply($receipt, $reply);
    }

    public function test_another_user_sees_no_receipt_under_the_same_key(): void
    {
        $this->journal->owner()->user('Sam');
        $command = new SaveLayoutCommand('Writing', LayoutShape::from(SaveLayoutTest::shape('chat')));
        $this->journal->run($command, 'key-1');

        $this->journal->actAs('Sam')->assertNoReceipt($command, 'key-1');
    }
}
