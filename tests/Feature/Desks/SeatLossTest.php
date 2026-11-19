<?php

declare(strict_types=1);

namespace Tests\Feature\Desks;

use App\Actors\Support\ActorIdentity;
use App\Agents\Models\Agent;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Assignments\Models\AssignmentRecord;
use App\Assignments\Models\ClaimAuthorization;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\AssignmentReference;
use App\Desks\Models\DeskRecord;
use App\Desks\Support\DeskSeating;
use App\Desks\Support\SeatChange;
use App\Desks\Support\SeatChangeResult;
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
        $desk = DeskRecord::openNamed('team', 'Team', 2, false);
        $leaving = ActorIdentity::of(Agent::named('Leaving', 'read-only-helper'));
        $staying = ActorIdentity::of(Agent::named('Staying', 'read-only-helper'));
        $arriving = ActorIdentity::of(Agent::named('Arriving', 'read-only-helper'));
        $leavingSeat = $this->seat($desk, $leaving);
        $stayingSeat = $this->seat($desk, $staying);
        $lostClaims = array_map(fn (int $number) => $this->claim($number, $leaving, $leavingSeat), [1, 2, 3]);
        $keptClaim = $this->claim(4, $staying, $stayingSeat);

        $this->app->make(AssignmentTransaction::class)->run(fn () => $this->app->make(DeskSeating::class)->replace(
            new SeatChange($desk->id, $leavingSeat->seatId, $leavingSeat->reference, $arriving),
        ));

        foreach ($lostClaims as $claim) {
            $this->assertFalse(AssignmentRecord::stillExists($claim->id));
        }

        $this->assertTrue(AssignmentRecord::stillExists($keptClaim->id));
        $taken = AssignmentRecord::holding(
            TestActors::record('communication.message', 1),
            AssigneeIdentity::ofActorIdentity($arriving),
        );
        $this->assertEquals(AssigneeIdentity::ofActorIdentity($arriving), $taken->toAssignment()->holder());
    }

    private function seat(DeskRecord $desk, ActorIdentity $actor): SeatChangeResult
    {
        return $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(DeskSeating::class)->seat($desk->id, $actor),
        );
    }

    private function claim(int $number, ActorIdentity $actor, SeatChangeResult $seat): AssignmentReference
    {
        $claim = AssignmentRecord::holding(
            TestActors::record('communication.message', $number),
            AssigneeIdentity::ofActorIdentity($actor),
        )->toAssignment()->reference;
        ClaimAuthorization::forInbox($claim, $seat->reference);

        return $claim;
    }
}
