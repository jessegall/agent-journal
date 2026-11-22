<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\CreateDesk\CreateDeskCommand;
use App\Contracts\Assignments\AssignmentTransaction;
use App\Contracts\Chat\ConversationResolver;
use App\Events\PageChanged;
use App\Models\DeskRecord;
use App\Models\DeskSeat;
use App\Support\DeskSeating;
use App\Support\SeatChange;
use App\Support\Storage\AssignmentStore;
use App\Support\UserChannel;
use Illuminate\Support\Facades\Event;
use Tests\Support\MessagingTestCase;

/**
 * A message only tells each user's own private channel that the page changed, with nothing in it; what the page
 * then reads is what the reader may see now, so an occupant removed from an inbox sees nothing of it.
 */
final class MessageRefreshTest extends MessagingTestCase
{
    public function test_a_message_refreshes_the_owners_own_channel_with_an_empty_payload(): void
    {
        Event::fake([PageChanged::class]);

        $this->ownerSends($this->inboxIdOf($this->builder), 'Refresh?');

        Event::assertDispatched(PageChanged::class, function (PageChanged $changed): bool {
            $channels = array_map(fn ($channel) => $channel->name, $changed->broadcastOn());

            return $changed->broadcastWith() === []
                && $channels === ['private-'.UserChannel::nameFor($this->owner->id)];
        });
    }

    public function test_an_occupant_removed_from_an_inbox_reads_nothing_of_it_on_the_next_refresh(): void
    {
        $desk = DeskRecord::query()->findOrFail($this->runOnBus(new CreateDeskCommand('Team', 1, false)));
        $seating = $this->app->make(DeskSeating::class);
        $this->app->make(AssignmentTransaction::class)->run(
            fn () => $seating->seat($desk->id, $this->actorOf($this->builder)),
        );
        $this->ownerSends($desk->inboxId(), 'For the team.');
        $this->asAgent($this->builder);
        $this->assertCount(1, $this->resolver()->history($desk->inboxId(), null, 50)->messages);
        $this->asOwner();

        $seat = DeskSeat::query()->ofDesk($desk)->sole();
        $this->app->make(AssignmentTransaction::class)->run(function () use ($desk, $seat, $seating): void {
            $current = $this->app->make(AssignmentStore::class)->lockCurrent($seat->assignmentIdentity())->get();
            $seating->replace(
                new SeatChange($desk->id, $seat->id, $current->reference, $this->actorOf($this->reviewer)),
            );
        });

        $this->asAgent($this->builder);
        $this->assertSame([], $this->resolver()->history($desk->inboxId(), null, 50)->messages);
        $this->assertSame(0, $this->resolver()->counts($desk->inboxId())->unread);
    }

    private function resolver(): ConversationResolver
    {
        return $this->app->make(ConversationResolver::class);
    }
}
