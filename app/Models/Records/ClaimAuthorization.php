<?php

declare(strict_types=1);

namespace App\Models\Records;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Models\Inboxes\InboxMember;
use App\Models\Support\JournalModel;
use App\Records\Contracts\ReadableModel;
use App\Records\Enums\ClaimBasis;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentReference;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property string $id
 * @property string $claim_assignment_id
 * @property ClaimBasis $basis_type
 * @property string|null $inbox_member_id
 * @property string $work_assignment_id
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
#[Table('claim_authorizations')]
final class ClaimAuthorization extends JournalModel implements ReadableModel
{
    use BoundedReads;
    use Linkable;

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return ['basis_type' => ClaimBasis::class];
    }

    // ----------[ Predicates ]----------

    /**
     * Whether the exact assignments the claim stands on still exist and are still held as they were proved.
     */
    public function isValidFor(AssigneeIdentity $claimant): bool
    {
        return $this->isValidAgainst(
            $claimant,
            AssignmentRecord::resolveHoldersOf($this->sourceIds()),
            InboxMember::resolveActiveIdsAmong(array_filter([$this->inbox_member_id])),
        );
    }

    /**
     * The same check against the current holders of the source assignments, read beforehand for many proofs.
     *
     * @param  array<string, AssigneeIdentity>  $liveHolders
     * @param  list<string>  $activeMemberIds
     */
    public function isValidAgainst(AssigneeIdentity $claimant, array $liveHolders, array $activeMemberIds): bool
    {
        $work = $liveHolders[$this->work_assignment_id] ?? null;
        $isMember = ! $this->basis_type->needsMembership() || in_array($this->inbox_member_id, $activeMemberIds, true);
        $workHolds = $work !== null && (! $this->basis_type->needsClaimantToHoldWork() || $work->isSameAs($claimant));

        return $isMember && $workHolds;
    }

    // ----------[ Transformers ]----------

    /**
     * The ids of the assignments the claim stands on.
     *
     * @return list{string}
     */
    public function sourceIds(): array
    {
        return [$this->work_assignment_id];
    }

    // ----------[ Internals ]----------

    private static function prove(
        AssignmentReference $claim,
        ClaimBasis $basis,
        string|null $memberId,
        string $workId,
    ): self {
        $proof = new self();
        $proof->claim_assignment_id = $claim->id;
        $proof->basis_type = $basis;
        $proof->inbox_member_id = $memberId;
        $proof->work_assignment_id = $workId;

        $proof->save();

        return $proof;
    }

    // ----------[ Queries ]----------

    /**
     * A task run claimed through the claimant's membership of the inbox that holds the task.
     */
    public static function findForInboxRun(AssignmentReference $claim, InboxMember $member, AssignmentReference $work): self
    {
        return self::prove($claim, ClaimBasis::InboxRun, $member->id, $work->id);
    }

    /**
     * A task run claimed by the actor that holds the task itself.
     */
    public static function findForDirectRun(AssignmentReference $claim, AssignmentReference $work): self
    {
        return self::prove($claim, ClaimBasis::DirectRun, null, $work->id);
    }

    /**
     * The proof behind one claim, when it has one.
     */
    public static function findForClaim(string $assignmentId): self|null
    {
        return self::query()->forClaim($assignmentId)->first();
    }

    /**
     * The proofs behind these claims, keyed by claim assignment id.
     *
     * @param  list<string>  $assignmentIds
     * @return array<string, self>
     */
    public static function findForClaims(array $assignmentIds): array
    {
        return self::query()
            ->forClaims($assignmentIds)
            ->readExactly(count($assignmentIds))
            ->get()
            ->keyBy('claim_assignment_id')
            ->all();
    }

    // ----------[ Scopes ]----------

    /**
     * The claim's authorization.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forClaim(Builder $query, string $assignmentId): void
    {
        $query->where('claim_assignment_id', $assignmentId);
    }

    /**
     * The authorizations of the claims.
     *
     * @param  Builder<self>  $query
     * @param  list<string>  $assignmentIds
     */
    #[Scope]
    protected function forClaims(Builder $query, array $assignmentIds): void
    {
        $query->whereIn('claim_assignment_id', $assignmentIds);
    }

    /**
     * The authorizations the work assignment grants.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forWork(Builder $query, AssignmentReference $source): void
    {
        $query->where('work_assignment_id', $source->id);
    }

    /**
     * The ids of the claims that stand on this exact assignment, as a subquery.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function claimIdsFor(Builder $query, AssignmentReference $source): void
    {
        $query->select('claim_assignment_id')->forWork($source);
    }
}
