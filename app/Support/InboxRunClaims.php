<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Assignments\AssignmentStorage;
use App\Contracts\Assignments\ResponsibilityWriter;
use App\Contracts\Processes\RunClaims;
use App\Enums\Assignments\ActorType;
use App\Exceptions\RunClaimRefused;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Models\Records\ClaimAuthorization;
use PhpOption\Option;

/**
 * Run claims proved by the work's current holder: the actor itself for a direct run, or the actor's membership of the
 * inbox that holds the work for an inbox run.
 */
final readonly class InboxRunClaims implements RunClaims
{
    public function __construct(
        private AssignmentStorage $store,
        private ResponsibilityWriter $responsibilities,
        private ProvedClaims $proved,
    ) {}

    public function take(RecordIdentity $run, RecordIdentity $work, ActorIdentity $actor): RunClaim
    {
        $claimant = AssigneeIdentity::ofActorIdentity($actor);
        $current = $this->store->lockCurrent($run);

        if ($current->isDefined()) {
            $proof = ClaimAuthorization::ofClaim($current->get()->reference->id);
            $holder = $current->get()->holder();

            if ($proof !== null && $proof->isValidFor($holder)) {
                if ($holder->isSameAs($claimant)) {
                    return new RunClaim($current->get()->reference, $proof->sourceIds());
                }

                throw RunClaimRefused::claimedByAnother($run->id);
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

        return array_map(fn (Assignment $claim) => self::claimantOf($claim), $claims);
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

        if ($current->isDefined()) {
            return $current->get();
        }

        return $this->store->assignIfUnheld($work, $claimant);
    }

    /**
     * @throws RunClaimRefused
     */
    private function claim(RecordIdentity $run, Assignment $work, AssigneeIdentity $claimant): RunClaim
    {
        if ($work->holder()->isSameAs($claimant)) {
            $claim = $this->responsibilities->assign($run, $claimant)->reference;

            return new RunClaim($claim, ClaimAuthorization::forDirectRun($claim, $work->reference)->sourceIds());
        }

        if ($work->holder()->type !== Inbox::ASSIGNEE_TYPE) {
            throw RunClaimRefused::notTheHolder($run->id);
        }

        $member = InboxMember::activeOf(
            $work->holder()->id,
            new ActorIdentity(ActorType::from($claimant->type), $claimant->id),
        )->getOrThrow(RunClaimRefused::notTheHolder($run->id));
        $claim = $this->responsibilities->assign($run, $claimant)->reference;
        $proof = ClaimAuthorization::forInboxRun($claim, $member, $work->reference);

        return new RunClaim($claim, $proof->sourceIds());
    }

    private static function claimantOf(Assignment $claim): ActorIdentity
    {
        return new ActorIdentity(ActorType::from($claim->holder()->type), $claim->holder()->id);
    }
}
