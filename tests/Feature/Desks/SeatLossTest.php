<?php

declare(strict_types=1);

namespace Tests\Feature\Desks;

use App\Contracts\Assignments\AssignmentTransaction;
use App\Models\Agents\Agent;
use App\Models\Desks\DeskRecord;
use App\Models\Records\AssignmentRecord;
use App\Models\Records\ClaimAuthorization;
use App\Support\ActorIdentity;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentReference;
use App\Support\DeskSeatService;
use App\Support\DeskService;
use App\Support\SeatChange;
use App\Support\SeatChangeResult;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsOwnerRequest;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * Losing a seat ends the claims it proved in the same commit and leaves every other occupant's claims, so the new
 * occupant can take the work at once.
 */
final class SeatLossTest extends TestCase
{
    use CommitsHookRows;
    use StartsOwnerRequest;

    private const array TABLES = [
        'users',
        'agents',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
        'claim_authorizations',
    ];

    public function test_replacing_a_seat_ends_its_claims_and_keeps_the_others(): void
    {
        $desk = $this->app->make(DeskService::class)->openNamed('team', 'Team', 2, false);
        $leaving = ActorIdentity::of(Agent::create('Leaving', 'read-only-helper'));
        $staying = ActorIdentity::of(Agent::create('Staying', 'read-only-helper'));
        $arriving = ActorIdentity::of(Agent::create('Arriving', 'read-only-helper'));
        $leavingSeat = $this->seat($desk, $leaving);
        $stayingSeat = $this->seat($desk, $staying);
        $lostClaims = array_map(fn (int $number) => $this->claim($number, $leaving, $leavingSeat), [1, 2, 3]);
        $keptClaim = $this->claim(4, $staying, $stayingSeat);

        $this->app->make(AssignmentTransaction::class)->run(fn () => $this->app->make(DeskSeatService::class)->replace(
            new SeatChange($desk->id, $leavingSeat->seatId, $leavingSeat->reference, $arriving),
        ));

        foreach ($lostClaims as $claim) {
            $this->assertFalse(array_key_exists($claim->id, AssignmentRecord::holdersOf([$claim->id])));
        }

        $this->assertTrue(array_key_exists($keptClaim->id, AssignmentRecord::holdersOf([$keptClaim->id])));
        $taken = AssignmentRecord::create(
            TestActors::record('core.messages.message', 1),
            AssigneeIdentity::ofActorIdentity($arriving),
        );
        $this->assertEquals(AssigneeIdentity::ofActorIdentity($arriving), $taken->toAssignment->holder());
    }

    private function seat(DeskRecord $desk, ActorIdentity $actor): SeatChangeResult
    {
        return $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(DeskSeatService::class)->seat($desk->id, $actor),
        );
    }

    private function claim(int $number, ActorIdentity $actor, SeatChangeResult $seat): AssignmentReference
    {
        $claim = AssignmentRecord::create(
            TestActors::record('core.messages.message', $number),
            AssigneeIdentity::ofActorIdentity($actor),
        )->toAssignment->reference;
        ClaimAuthorization::forInbox($claim, $seat->reference);

        return $claim;
    }
}
