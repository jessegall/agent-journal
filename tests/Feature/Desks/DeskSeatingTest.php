<?php

declare(strict_types=1);

namespace Tests\Feature\Desks;

use App\Actors\Support\ActorIdentity;
use App\Agents\Models\Agent;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Bus\Contracts\CommandBus;
use App\Bus\Support\RequestKey;
use App\Desks\Commands\SeatActor;
use App\Desks\Contracts\SeatingWriter;
use App\Desks\Exceptions\SeatCapacityReached;
use App\Desks\Exceptions\SeatConflict;
use App\Desks\Exceptions\SecondForwardingSeat;
use App\Desks\Models\DeskRecord;
use App\Desks\Support\SeatChange;
use App\Desks\Support\SeatRelease;
use Closure;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * Seating: an actor is seated, replaced by the expected reference and released, a stale reference conflicts, an
 * actor forwards to one desk at most, a full desk refuses, and every change advances the desk's seating revision.
 */
final class DeskSeatingTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = ['users', 'agents', 'inboxes', 'desks', 'desk_seats', 'assignments', 'command_receipts'];

    private ActorIdentity $builder;

    private ActorIdentity $reviewer;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->builder = ActorIdentity::of(Agent::named('Builder', 'read-only-helper'));
        $this->reviewer = ActorIdentity::of(Agent::named('Reviewer', 'read-only-helper'));
        $this->startUserRequestAs($owner->id);
    }

    public function test_an_actor_is_seated_replaced_and_released_and_each_change_advances_the_revision(): void
    {
        $desk = DeskRecord::openNamed('team', 'Team', 2, true);
        $seating = $this->app->make(SeatingWriter::class);

        $seated = $this->inTransaction(fn () => $seating->seat($desk->id, $this->builder));
        $again = $this->inTransaction(fn () => $seating->seat($desk->id, $this->builder));

        $this->assertTrue($seated->reference->isSameAs($again->reference));
        $this->assertSame(1, $desk->refresh()->seating_revision);

        $seatId = $seated->seatId;
        $replaced = $this->inTransaction(
            fn () => $seating->replace(new SeatChange($desk->id, $seatId, $seated->reference, $this->reviewer)),
        );

        $this->assertSame($this->reviewer->id, $replaced->reference->holder->id);
        $this->assertSame(2, $desk->refresh()->seating_revision);
        $this->assertThrows(
            fn () => $this->inTransaction(
                fn () => $seating->replace(new SeatChange($desk->id, $seatId, $seated->reference, $this->builder)),
            ),
            SeatConflict::class,
        );

        $this->inTransaction(fn () => $seating->release(new SeatRelease($desk->id, $seatId, $replaced->reference)));

        $this->assertSame(3, $desk->refresh()->seating_revision);
    }

    public function test_an_actor_at_main_is_refused_a_second_forwarding_seat_and_a_full_desk_refuses(): void
    {
        $main = DeskRecord::openNamed('main', 'Main', 1, true);
        $other = DeskRecord::openNamed('team', 'Team', 2, true);
        $seating = $this->app->make(SeatingWriter::class);
        $this->inTransaction(fn () => $seating->seat($main->id, $this->builder));

        $this->assertThrows(
            fn () => $this->inTransaction(fn () => $seating->seat($other->id, $this->builder)),
            SecondForwardingSeat::class,
        );
        $this->assertThrows(
            fn () => $this->inTransaction(fn () => $seating->seat($main->id, $this->reviewer)),
            SeatCapacityReached::class,
        );
    }

    public function test_the_seat_command_seats_an_actor(): void
    {
        $desk = DeskRecord::openNamed('team', 'Team', 2, false);
        $this->app->make(RequestKey::class)->set('seat-the-builder');

        $result = $this->app->make(CommandBus::class)->run(new SeatActor($desk->id, $this->builder));

        $this->assertSame($this->builder->id, $result->reference->holder->id);
        $this->assertSame(1, $desk->refresh()->seating_revision);
    }

    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    private function inTransaction(Closure $work): mixed
    {
        return $this->app->make(AssignmentTransaction::class)->run($work);
    }
}
