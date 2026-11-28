<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Routes;

use App\Messages\Commands\RetryDelivery\RetryDeliveryCommand;
use App\Messages\Commands\SendMessage\SendMessageCommand;
use App\Models\Messages\Message;
use Carbon\CarbonImmutable;
use Domain\Chat\ChatDomain;
use Domain\Chat\Tests\Fixtures\ChatFixtures;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The sender of a message that was not delivered queues it again: its failure and reason are cleared.
 */
#[TestsRoute('POST', 'chat.retry-delivery')]
final class RetryDeliveryPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    public function test_a_retry_clears_the_failure_so_the_delivery_walks_again(): void
    {
        $this->journal->owner()->idleAgent('Planner');
        $chat = $this->journal->fixtures(ChatFixtures::class)->pairChatBetween('Owner', 'Planner')
            ->pairChatOf('Owner', 'Planner');
        $messageId = $this->journal->runAs('Owner', new SendMessageCommand($chat->id, 'Run the checks.'));
        Message::query()->findOrFail($messageId)->failDelivery('The start was refused.', CarbonImmutable::now());

        $this->journal->route('POST', 'chat.retry-delivery', payload: [
            'messageId' => $messageId,
        ], headers: ['Idempotency-Key' => strtolower((string) Str::ulid())])->assertRedirect();

        $message = Message::query()->findOrFail($messageId);
        $this->assertSame([null, null], [$message->delivery_failed_at, $message->delivery_failure]);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $messageId = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::User)
            ->payload(['messageId' => $messageId])
            ->expects(RetryDeliveryCommand::class, ['messageId' => $messageId]);
    }
}
