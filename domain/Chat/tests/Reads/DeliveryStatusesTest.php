<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Reads;

use App\Messages\Commands\SendMessage\SendMessageCommand;
use App\Models\Inboxes\Inbox;
use App\Models\Messages\Message;
use App\Models\Messages\MessageReadEntry;
use App\Sessions\Contracts\AgentDirectory;
use Carbon\CarbonImmutable;
use Domain\Chat\Data\MessageEntryData;
use Domain\Chat\Enums\DeliveryStatus;
use Domain\Chat\Resolvers\Support\ChatPages;
use Domain\Chat\Tests\Fixtures\ChatFixtures;
use Domain\Chat\Tests\TestCase;
use Tests\Support\CommitsHookRows;

/**
 * Each of the user's messages shows how far it got: sent, arrived in the agent's session, read by the agent, or not
 * delivered with its reason; it only moves forward.
 */
final class DeliveryStatusesTest extends TestCase
{
    use CommitsHookRows;

    protected const array TABLES = [];

    public function test_a_message_walks_from_sent_to_arrived_to_read_and_never_back(): void
    {
        [$chat, $message] = $this->sent();

        $this->assertSame(DeliveryStatus::Sent, $this->shown($chat)->delivery);

        $message->markDelivered(CarbonImmutable::now());
        $this->assertSame(DeliveryStatus::Arrived, $this->shown($chat)->delivery);

        $message->failDelivery('Too late.', CarbonImmutable::now());
        $this->assertSame(DeliveryStatus::Arrived, $this->shown($chat)->delivery);

        MessageReadEntry::create($message, $this->journal->agentCalled('Planner'), CarbonImmutable::now());
        $this->assertSame(DeliveryStatus::Read, $this->shown($chat)->delivery);
    }

    public function test_a_failed_delivery_shows_its_reason(): void
    {
        [$chat, $message] = $this->sent();

        $message->failDelivery('The start was refused.', CarbonImmutable::now());

        $shown = $this->shown($chat);

        $this->assertSame([
            DeliveryStatus::Failed,
            'The start was refused.',
        ], [
            $shown->delivery,
            $shown->deliveryFailure,
        ]);
    }

    /**
     * @return array{Inbox, Message}
     */
    private function sent(): array
    {
        $this->journal->owner()->idleAgent('Planner');

        $chat = $this->journal->fixtures(ChatFixtures::class)->pairChatBetween('Owner', 'Planner')
            ->pairChatOf('Owner', 'Planner');

        $id = $this->journal->runAs('Owner', new SendMessageCommand($chat->id, 'Run the checks.'));
        $this->journal->actAs('Owner');

        return [
            $chat,
            Message::query()->findOrFail($id),
        ];
    }

    private function shown(Inbox $chat): MessageEntryData
    {
        $planner = $this->journal->agentCalled('Planner')->id;
        $agent = $this->app->make(AgentDirectory::class)->visibleAgent($planner);
        $entries = $this->app->make(ChatPages::class)->pageFor($agent, $chat, null)->entries;

        return $entries[array_key_last($entries)]->message;
    }
}
