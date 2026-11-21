<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Communication\Data\NotificationTarget;
use App\Communication\Enums\NotificationSourceType;
use App\Communication\Events\NotificationsChanged;
use App\Communication\Models\NotificationScope;
use App\Communication\Support\NotificationDelivery;
use App\Web\Events\NotificationsInvalidated;
use App\Web\Listeners\BroadcastNotificationChanges;
use App\Web\Support\UserChannel;
use Illuminate\Support\Facades\Event;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * A committed change of a user's receipts sends one content-free signal to that user's channel; an agent's scope
 * sends nothing.
 */
final class NotificationBroadcastTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_users_new_receipt_signals_only_that_user_and_carries_no_title(): void
    {
        Event::fake([NotificationsInvalidated::class]);
        $jo = TestActors::userIdentity(2);
        $agent = TestActors::agentIdentity(5);

        $this->app->make(NotificationDelivery::class)->deliver(
            'question:73',
            NotificationSourceType::Question,
            new NotificationTarget('chat.question', '73'),
            [$jo, $agent],
        );

        foreach (NotificationScope::query()->get() as $scope) {
            $this->app->make(BroadcastNotificationChanges::class)->handle(new NotificationsChanged($scope->id));
        }

        Event::assertDispatchedTimes(NotificationsInvalidated::class, 1);
        Event::assertDispatched(NotificationsInvalidated::class, function (NotificationsInvalidated $signal) use ($jo) {
            $channels = array_map(fn ($channel) => $channel->name, $signal->broadcastOn());

            return $channels === ['private-'.UserChannel::nameFor($jo->id)] && $signal->broadcastWith() === [];
        });
    }
}
