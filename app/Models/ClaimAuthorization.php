<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\ReadableModel;
use App\Enums\ClaimBasis;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentReference;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * Why one claim was allowed: the exact assignments it stands on, kept as their ids. The ids are history, not live
 * references, so a claim stays valid only while those exact assignments still exist and are held as proved.
 *
 * @property string $id
 * @property string $claim_assignment_id
 * @property ClaimBasis $basis_type
 * @property string|null $participation_assignment_id
 * @property string|null $work_assignment_id
 */
#[Table('claim_authorizations')]
#[Fillable(['claim_assignment_id', 'basis_type', 'participation_assignment_id', 'work_assignment_id'])]
final class ClaimAuthorization extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return ['basis_type' => ClaimBasis::class];
    }

    // ----------[ Queries ]----------

    /**
     * A waiting message claimed through the claimant's seat at the inbox's desk.
     */
    public static function forInbox(AssignmentReference $claim, AssignmentReference $participation): self
    {
        return self::prove($claim, ClaimBasis::Inbox, $participation->id, null);
    }

    /**
     * A task run claimed through the claimant's seat at the desk that holds the task.
     */
    public static function forDeskRun(
        AssignmentReference $claim,
        AssignmentReference $participation,
        AssignmentReference $work,
    ): self {
        return self::prove($claim, ClaimBasis::DeskRun, $participation->id, $work->id);
    }

    /**
     * A task run claimed by the actor that holds the task itself.
     */
    public static function forDirectRun(AssignmentReference $claim, AssignmentReference $work): self
    {
        return self::prove($claim, ClaimBasis::DirectRun, null, $work->id);
    }

    /**
     * The proof behind one claim, when it has one.
     */
    public static function ofClaim(string $assignmentId): self|null
    {
        return self::query()->where('claim_assignment_id', $assignmentId)->first();
    }

    /**
     * The ids of the claims that stand on this exact assignment, as a subquery.
     *
     * @return Builder<self>
     */
    public static function claimIdsFor(AssignmentReference $source): Builder
    {
        return self::query()
            ->select('claim_assignment_id')
            ->where(fn (Builder $query) => $query
                ->where('participation_assignment_id', $source->id)
                ->orWhere('work_assignment_id', $source->id));
    }

    /**
     * The proofs behind these claims, keyed by claim assignment id.
     *
     * @param  list<string>  $assignmentIds
     * @return array<string, self>
     */
    public static function ofClaims(array $assignmentIds): array
    {
        return self::query()
            ->whereIn('claim_assignment_id', $assignmentIds)
            ->readExactly(count($assignmentIds))
            ->get()
            ->keyBy('claim_assignment_id')
            ->all();
    }

    // ----------[ Answers ]----------

    /**
     * Whether the exact assignments the claim stands on still exist and are still held as they were proved.
     */
    public function isValidFor(AssigneeIdentity $claimant): bool
    {
        return $this->isValidAgainst($claimant, AssignmentRecord::holdersOf($this->sourceIds()));
    }

    /**
     * The same check against the current holders of the source assignments, read beforehand for many proofs.
     *
     * @param  array<string, AssigneeIdentity>  $liveHolders
     */
    public function isValidAgainst(AssigneeIdentity $claimant, array $liveHolders): bool
    {
        $participation = $liveHolders[(string) $this->participation_assignment_id] ?? null;
        $work = $liveHolders[(string) $this->work_assignment_id] ?? null;

        $participationHolds = ! $this->basis_type->needsParticipation()
            || ($participation !== null && $participation->isSameAs($claimant));

        $workHolds = ! $this->basis_type->needsWork()
            || ($work !== null && (! $this->basis_type->needsClaimantToHoldWork() || $work->isSameAs($claimant)));

        return $participationHolds && $workHolds;
    }

    /**
     * The ids of the assignments the claim stands on.
     *
     * @return list<string>
     */
    public function sourceIds(): array
    {
        return array_values(array_filter([$this->participation_assignment_id, $this->work_assignment_id]));
    }

    // ----------[ Internals ]----------

    private static function prove(
        AssignmentReference $claim,
        ClaimBasis $basis,
        string|null $participationId,
        string|null $workId,
    ): self {
        $proof = new self([
            'claim_assignment_id' => $claim->id,
            'basis_type' => $basis,
            'participation_assignment_id' => $participationId,
            'work_assignment_id' => $workId,
        ]);

        $proof->save();

        return $proof;
    }
}
