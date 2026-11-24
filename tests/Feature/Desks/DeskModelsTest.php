<?php

declare(strict_types=1);

namespace Tests\Feature\Desks;

use App\Contracts\Inboxes\InboxResolver;
use App\Exceptions\DeskSeatCountInvalid;
use App\Exceptions\InboxUnavailable;
use App\Models\Agents\Agent;
use App\Models\Inboxes\Inbox;
use App\Models\Desks\DeskRecord;
use App\Models\Desks\DeskSeat;
use App\Models\Records\AssignmentRecord;
use App\Support\AssigneeIdentity;
use App\Support\DeskInboxAccess;
use App\Support\DeskService;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A desk opens with its inbox and its seats, resolves as an inbox, and admits to its inbox only the actors seated at
 * it, each proven by the exact assignment of its seat.
 */
final class DeskModelsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_named_desk_opens_with_its_inbox_and_seats(): void
    {
        $desk = $this->app->make(DeskService::class)->openNamed('team', 'Team', 3, false);

        $this->assertSame([1, 2, 3], DeskSeat::query()->ofDesk($desk)->orderBy('number')->pluck('number')->all());
        $this->assertSame(1, Inbox::query()->count());
        $this->assertSame($desk->id, $this->app->make(InboxResolver::class)->resolve($desk->inboxId())->deskId());
        $this->assertSame('Team', $desk->inboxLabel());
        $this->assertTrue($desk->assigneeIdentity()->isSameAs(new AssigneeIdentity('desk', $desk->id)));
    }

    public function test_a_named_desk_has_one_to_a_hundred_seats_and_a_source_desk_none(): void
    {
        $this->assertThrows(fn () => $this->app->make(DeskService::class)->openNamed('empty', 'Empty', 0, false), DeskSeatCountInvalid::class);
        $this->assertThrows(fn () => $this->app->make(DeskService::class)->openNamed('crowd', 'Crowd', 101, false), DeskSeatCountInvalid::class);

        $source = $this->app->make(DeskService::class)->openSourceDesk('journal', 'Journal');

        $this->assertSame(0, DeskSeat::query()->ofDesk($source)->count());
    }

    public function test_the_inbox_admits_a_seated_actor_by_its_seat_assignment_and_refuses_others(): void
    {
        $desk = $this->app->make(DeskService::class)->openNamed('team', 'Team', 3, false);
        $seated = Agent::create('Seated', 'read-only-helper');
        $stranger = Agent::create('Stranger', 'read-only-helper');
        $seat = DeskSeat::query()->ofDesk($desk)->where('number', 2)->sole();
        $held = AssignmentRecord::create($seat->assignmentIdentity(), AssigneeIdentity::of($seated));
        $access = $this->app->make(DeskInboxAccess::class);

        $membership = $access->membership($desk, $seated);

        $this->assertSame($held->id, $membership->deskSeat()->id);
        $this->assertSame($seated->id, $membership->actor->id);
        $this->assertCount(1, $access->members($desk)->memberships);
        $this->assertSame([$desk->id], DeskRecord::query()->occupiedBy($membership->actor)->pluck('id')->all());
        $this->assertThrows(fn () => $access->membership($desk, $stranger), InboxUnavailable::class);
    }
}
