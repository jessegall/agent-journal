<?php

declare(strict_types=1);

namespace Tests\Feature\Desks;

use App\Agents\Enums\AgentRole;
use App\Agents\Models\Agent;
use App\Assignments\Models\AssignmentRecord;
use App\Assignments\Support\AssigneeIdentity;
use App\Communication\Contracts\InboxResolver;
use App\Communication\Exceptions\InboxUnavailable;
use App\Communication\Models\InboxRecord;
use App\Desks\Exceptions\DeskSeatCountInvalid;
use App\Desks\Models\DeskRecord;
use App\Desks\Models\DeskSeat;
use App\Desks\Support\DeskInboxAccess;
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
        $desk = DeskRecord::openNamed('team', 'Team', 3, false);

        $this->assertSame([1, 2, 3], DeskSeat::query()->ofDesk($desk)->orderBy('number')->pluck('number')->all());
        $this->assertSame(1, InboxRecord::query()->count());
        $this->assertSame($desk->id, $this->app->make(InboxResolver::class)->resolve($desk->inboxId())->deskId());
        $this->assertSame('Team', $desk->inboxLabel());
        $this->assertTrue($desk->assigneeIdentity()->isSameAs(new AssigneeIdentity('desk', $desk->id)));
    }

    public function test_a_named_desk_has_one_to_a_hundred_seats_and_a_source_desk_none(): void
    {
        $this->assertThrows(fn () => DeskRecord::openNamed('empty', 'Empty', 0, false), DeskSeatCountInvalid::class);
        $this->assertThrows(fn () => DeskRecord::openNamed('crowd', 'Crowd', 101, false), DeskSeatCountInvalid::class);

        $source = DeskRecord::openSourceDesk('journal', 'Journal');

        $this->assertSame(0, DeskSeat::query()->ofDesk($source)->count());
    }

    public function test_the_inbox_admits_a_seated_actor_by_its_seat_assignment_and_refuses_others(): void
    {
        $desk = DeskRecord::openNamed('team', 'Team', 3, false);
        $seated = Agent::named('Seated', AgentRole::ReadOnlyHelper);
        $stranger = Agent::named('Stranger', AgentRole::ReadOnlyHelper);
        $seat = DeskSeat::query()->ofDesk($desk)->where('number', 2)->sole();
        $held = AssignmentRecord::holding($seat->assignmentIdentity(), AssigneeIdentity::of($seated));
        $access = $this->app->make(DeskInboxAccess::class);

        $membership = $access->membership($desk, $seated);

        $this->assertSame($held->id, $membership->seatReference->id);
        $this->assertSame($seated->id, $membership->actor->id);
        $this->assertCount(1, $access->members($desk)->memberships);
        $this->assertSame([$desk->id], DeskRecord::query()->occupiedBy($membership->actor)->pluck('id')->all());
        $this->assertThrows(fn () => $access->membership($desk, $stranger), InboxUnavailable::class);
    }
}
