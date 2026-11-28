<?php

declare(strict_types=1);

namespace Tests\Commands\Messages;

use App\Exceptions\InboxUnavailable;
use App\Messages\Commands\RetryDelivery\RetryDeliveryCommand;
use Carbon\CarbonImmutable;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

#[TestsCommand(RetryDeliveryCommand::class)]
final class RetryDeliveryTest extends TestCase
{
    use CommitsHookRows;

    protected const array TABLES = [];

    public function test_only_the_sender_can_queue_a_failed_message_again(): void
    {
        $this->journal->owner()->idleAgent('Planner')->sharedInbox('Owner', 'Planner');
        $chat = $this->journal->sharedInboxOf('Owner', 'Planner');
        $message = $this->journal->post('Owner', $chat, 'Run the build.');
        $message->failDelivery('The start was refused.', CarbonImmutable::now());

        $this->assertThrows(
            fn () => $this->journal->runAs('Planner', new RetryDeliveryCommand($message->id)),
            InboxUnavailable::class,
        );
        $this->assertNotNull($message->refresh()->delivery_failed_at);

        $this->journal->runAs('Owner', new RetryDeliveryCommand($message->id));

        $message->refresh();
        $this->assertNull($message->delivery_failed_at);
        $this->assertNull($message->delivery_failure);
    }
}
