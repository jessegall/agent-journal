<?php

declare(strict_types=1);

namespace Domain\Plans\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Support\ActorIdentity;
use Domain\Plans\Enums\PlanReviewState;
use Domain\Plans\Events\PlanReviewEditionApproved;
use Domain\Plans\Events\PlanReviewEditionChangesRequested;
use Domain\Plans\Events\PlanReviewEditionOutdated;
use Domain\Plans\Events\PlanReviewEditionWithdrawn;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $plan_id
 * @property int $number
 * @property string $requested_by_type
 * @property string $requested_by_id
 * @property int $plan_revision
 * @property PlanReviewState $state
 * @property ?string $decided_by_type
 * @property ?string $decided_by_id
 * @property ?Carbon $decided_at
 * @property ?string $decision_reason
 * @property ?string $decision_request_key
 * @property bool $is_historical
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 */
final class PlanReviewEdition extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'number' => 'integer',
            'plan_revision' => 'integer',
            'state' => PlanReviewState::class,
            'decided_at' => 'datetime',
            'is_historical' => 'boolean',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * The plan's next review, asked for by the actor, at the plan's revision as it is now.
     */
    public static function create(Plan $plan, ActorIdentity $actor): self
    {
        $planReviewEdition = new self();
        $planReviewEdition->plan_id = $plan->id;
        $planReviewEdition->number = (int) self::query()->ofPlan($plan->id)->max('number') + 1;
        $planReviewEdition->requested_by_type = $actor->type;
        $planReviewEdition->requested_by_id = $actor->id;
        $planReviewEdition->plan_revision = $plan->revision;
        $planReviewEdition->state = PlanReviewState::Requested;
        $planReviewEdition->assertSaved($planReviewEdition->save());

        return $planReviewEdition;
    }

    // ----------[ Mutations ]----------

    /**
     * The edition is withdrawn by the actor before any decision.
     */
    public function withdraw(ActorIdentity $actor): void
    {
        $this->state = PlanReviewState::Withdrawn;
        $this->decided_by_type = $actor->type;
        $this->decided_by_id = $actor->id;
        $this->decided_at = Carbon::now();
        $this->assertSaved($this->save());
        $this->raise(new PlanReviewEditionWithdrawn($this->id));
    }

    /**
     * Approves the review for the actor under the decision's request key; its decider and time are the receipt.
     */
    public function approve(ActorIdentity $actor, string $requestKey): void
    {
        $this->decide(PlanReviewState::Approved, $actor, $requestKey, null);
        $this->raise(new PlanReviewEditionApproved($this->id));
    }

    /**
     * Sends the edition back with the changes the actor asks for.
     */
    public function requestChanges(ActorIdentity $actor, string $requestKey, string $reason): void
    {
        $this->decide(PlanReviewState::ChangesRequested, $actor, $requestKey, $reason);
        $this->raise(new PlanReviewEditionChangesRequested($this->id));
    }

    /**
     * The plan changed after this approval: the approval stays recorded but no longer matches the plan.
     */
    public function markHistorical(): void
    {
        $this->is_historical = true;
        $this->assertSaved($this->save());
        $this->raise(new PlanReviewEditionOutdated($this->id));
    }

    // ----------[ Internals ]----------

    private function decide(PlanReviewState $state, ActorIdentity $actor, string $requestKey, string|null $reason): void
    {
        $this->state = $state;
        $this->decided_by_type = $actor->type;
        $this->decided_by_id = $actor->id;
        $this->decided_at = Carbon::now();
        $this->decision_request_key = $requestKey;
        $this->decision_reason = $reason;
        $this->save();
    }

    // ----------[ Queries ]----------

    /**
     * The plan's edition still asked for, if any.
     */
    public static function requestedOf(string $planId): self|null
    {
        return self::query()->ofPlan($planId)->inState(PlanReviewState::Requested)->newestNumberFirst()->first();
    }

    /**
     * The plan's edition with this number, if any.
     */
    public static function numberedIn(string $planId, int $number): self|null
    {
        return self::query()->ofPlan($planId)->numbered($number)->first();
    }

    /**
     * The plan's latest edition, whatever its state, if any.
     */
    public static function latestOf(string $planId): self|null
    {
        return self::query()->ofPlan($planId)->newestNumberFirst()->first();
    }

    /**
     * The plan's latest approved edition, current or historical, if any.
     */
    public static function latestApprovalOf(string $planId): self|null
    {
        return self::query()->ofPlan($planId)->inState(PlanReviewState::Approved)->newestNumberFirst()->first();
    }

    /**
     * The plan's latest approved edition that still matches the plan, if any.
     */
    public static function currentApprovalOf(string $planId): self|null
    {
        return self::query()->ofPlan($planId)->inState(PlanReviewState::Approved)->current()
            ->newestNumberFirst()
            ->first();
    }

    // ----------[ Scopes ]----------

    /**
     * The plan's editions.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofPlan(Builder $query, string $planId): void
    {
        $query->where('plan_id', $planId);
    }

    /**
     * The editions in that state.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inState(Builder $query, PlanReviewState $state): void
    {
        $query->where('state', $state);
    }

    /**
     * The edition of that number.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function numbered(Builder $query, int $number): void
    {
        $query->where('number', $number);
    }

    /**
     * The editions not made historical.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function current(Builder $query): void
    {
        $query->where('is_historical', false);
    }

    /**
     * The editions newest number first.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function newestNumberFirst(Builder $query): void
    {
        $query->orderByDesc('number');
    }
}
