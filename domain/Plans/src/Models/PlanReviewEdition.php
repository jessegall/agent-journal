<?php

declare(strict_types=1);

namespace Domain\Plans\Models;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Domain\Plans\Enums\PlanReviewState;
use Domain\Plans\Enums\PlanType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One frozen edition of a plan put up for review: the plan's title, brief and type as they were, a fingerprint over
 * its ordered content, and its decision once made. Its phases and members are kept beside it and never change; an
 * edit of the plan afterwards makes an approved edition historical.
 *
 * @property string $id
 * @property string $plan_id
 * @property int $number
 * @property ActorType $requested_by_type
 * @property string $requested_by_id
 * @property int $plan_revision
 * @property string $title
 * @property string $brief
 * @property PlanType $type
 * @property string $fingerprint
 * @property PlanReviewState $state
 * @property ActorType|null $decided_by_type
 * @property string|null $decided_by_id
 * @property Carbon|null $decided_at
 * @property string|null $decision_reason
 * @property string|null $decision_request_key
 * @property bool $is_historical
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'plan_id',
    'number',
    'requested_by_type',
    'requested_by_id',
    'plan_revision',
    'title',
    'brief',
    'type',
    'fingerprint',
    'state',
])]
final class PlanReviewEdition extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'number' => 'integer',
            'requested_by_type' => ActorType::class,
            'plan_revision' => 'integer',
            'type' => PlanType::class,
            'state' => PlanReviewState::class,
            'decided_by_type' => ActorType::class,
            'decided_at' => 'datetime',
            'is_historical' => 'boolean',
        ];
    }

    /**
     * The plan's next edition, asked for by the actor, with the plan's own text as it is now; its content is frozen
     * beside it and sealed with its fingerprint.
     */
    public static function open(Plan $plan, ActorIdentity $actor): self
    {
        return self::query()->create([
            'plan_id' => $plan->id,
            'number' => (int) self::query()->where('plan_id', $plan->id)->max('number') + 1,
            'requested_by_type' => $actor->type,
            'requested_by_id' => $actor->id,
            'plan_revision' => $plan->revision,
            'title' => $plan->title,
            'brief' => $plan->brief,
            'type' => $plan->type,
            'fingerprint' => '',
            'state' => PlanReviewState::Requested,
        ]);
    }

    // ----------[ Queries ]----------

    /**
     * The plan's edition still asked for, if any.
     */
    public static function requestedOf(string $planId): self|null
    {
        return self::query()->where('plan_id', $planId)->where('state', PlanReviewState::Requested)
            ->orderByDesc('number')->first();
    }

    /**
     * The plan's edition with this number, if any.
     */
    public static function numberedIn(string $planId, int $number): self|null
    {
        return self::query()->where('plan_id', $planId)->where('number', $number)->first();
    }

    /**
     * The plan's latest approved edition that still matches the plan, if any.
     */
    public static function currentApprovalOf(string $planId): self|null
    {
        return self::query()->where('plan_id', $planId)->where('state', PlanReviewState::Approved)
            ->where('is_historical', false)->orderByDesc('number')->first();
    }

    // ----------[ Mutations ]----------

    /**
     * Seals the frozen content with the fingerprint over it.
     */
    public function seal(string $fingerprint): void
    {
        $this->fingerprint = $fingerprint;
        $this->save();
    }

    /**
     * The edition is withdrawn by the actor before any decision.
     */
    public function withdraw(ActorIdentity $actor): void
    {
        $this->state = PlanReviewState::Withdrawn;
        $this->decided_by_type = $actor->type;
        $this->decided_by_id = $actor->id;
        $this->decided_at = Carbon::now();
        $this->save();
    }

    /**
     * Approves the edition for the actor under the decision's request key; its decider, time and fingerprint are the
     * receipt.
     */
    public function approve(ActorIdentity $actor, string $requestKey): void
    {
        $this->decide(PlanReviewState::Approved, $actor, $requestKey, null);
    }

    /**
     * Sends the edition back with the changes the actor asks for.
     */
    public function requestChanges(ActorIdentity $actor, string $requestKey, string $reason): void
    {
        $this->decide(PlanReviewState::ChangesRequested, $actor, $requestKey, $reason);
    }

    /**
     * The plan changed after this approval: the approval stays recorded but no longer matches the plan.
     */
    public function markHistorical(): void
    {
        $this->is_historical = true;
        $this->save();
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
}
