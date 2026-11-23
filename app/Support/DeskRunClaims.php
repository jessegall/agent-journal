<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Assignments\AssignmentStorage;
use App\Contracts\Assignments\ResponsibilityWriter;
use App\Contracts\Processes\RunClaims;
use App\Exceptions\RunClaimRefused;
use App\Models\Desks\DeskRecord;
use App\Models\Desks\DeskSeat;
use App\Models\Records\AssignmentRecord;
use App\Models\Records\ClaimAuthorization;
use PhpOption\Option;

/**
 * Run claims proved by the work's current holder: the actor itself for a direct run, or the actor's seat at the desk
 * that holds the work for a desk run.
 */
final readonly class DeskRunClaims implements RunClaims
{
    public function __construct(
        private AssignmentStorage $store,
        private ResponsibilityWriter $responsibilities,
        private ProvedClaims $proved,
    ) {}

    public function take(RecordIdentity $run, RecordIdentity $work, ActorIdentity $actor): AssignmentReference
    {
        $claimant = AssigneeIdentity::ofActorIdentity($actor);
        $current = $this->store->lockCurrent($run);

        if ($current->isDefined()) {
            $proof = ClaimAuthorization::ofClaim($current->get()->reference->id);
            $holder = $current->get()->holder();

            if ($proof !== null && $proof->isValidFor($holder)) {
                return $holder->isSameAs($claimant)
                    ? $current->get()->reference
                    : throw RunClaimRefused::claimedByAnother($run->id);
            }

            $this->responsibilities->release($run, $current->get()->reference);
        }

        return $this->claim($run, $this->workOf($work, $claimant), $claimant);
    }

    public function holdersOf(array $runs): array
    {
        if ($runs === []) {
            return [];
        }

        $claims = $this->proved->validClaimsOn($runs[0]->type, array_map(fn (RecordIdentity $run) => $run->id, $runs));

        return array_map(fn (Assignment $claim) => SeatOccupant::of($claim), $claims);
    }

    public function holderOf(RecordIdentity $run): Option
    {
        return Option::fromValue($this->holdersOf([$run])[$run->id] ?? null);
    }

    public function release(RecordIdentity $run): void
    {
        $current = $this->store->lockCurrent($run);

        if ($current->isDefined()) {
            $this->responsibilities->release($run, $current->get()->reference);
        }
    }

    /**
     * The work's current assignment; work nobody holds is given to the claimant as it starts.
     */
    private function workOf(RecordIdentity $work, AssigneeIdentity $claimant): Assignment
    {
        $current = $this->store->lockCurrent($work);

        return $current->isDefined() ? $current->get() : $this->store->assignIfUnheld($work, $claimant);
    }

    /**
     * @throws RunClaimRefused
     */
    private function claim(RecordIdentity $run, Assignment $work, AssigneeIdentity $claimant): AssignmentReference
    {
        if ($work->holder()->isSameAs($claimant)) {
            $claim = $this->responsibilities->assign($run, $claimant)->reference;
            ClaimAuthorization::forDirectRun($claim, $work->reference);

            return $claim;
        }

        $seat = AssignmentRecord::query()
            ->assignedAmong(DeskSeat::LINK_TYPE, DeskSeat::query()->select('id')->where('desk_id', $work->holder()->id))
            ->heldBy($claimant)
            ->first();

        if ($work->holder()->type !== DeskRecord::ASSIGNEE_TYPE || $seat === null) {
            throw RunClaimRefused::notTheHolder($run->id);
        }

        $claim = $this->responsibilities->assign($run, $claimant)->reference;
        ClaimAuthorization::forDeskRun($claim, $seat->toAssignment()->reference, $work->reference);

        return $claim;
    }
}
