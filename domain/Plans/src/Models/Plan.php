<?php

declare(strict_types=1);

namespace Domain\Plans\Models;

use App\Assignments\Contracts\Assignable;
use App\Assignments\Models\Support\AssignableListing;
use App\Assignments\Support\AssignmentHolder;
use App\Assignments\Support\RecordIdentity;
use App\Links\Support\Linkable;
use App\Numbers\Contracts\Numbered;
use App\Numbers\Support\HasNumber;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Domain\Plans\Api\PlanCard;
use Domain\Plans\Api\PlanProgress;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Exceptions\PhaseMissing;
use Domain\Plans\Exceptions\StartDenied;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use PhpOption\Option;

/**
 * A goal with phases in order and the tasks in each phase. Every agent and the owner read every plan, so it has no
 * agent limit (rule 4, message 519).
 *
 * @property string $id
 * @property string $title
 * @property PlanType $type
 * @property PlanState $state
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['title', 'type'])]
final class Plan extends Model implements Assignable, Numbered, ReadableModel
{
    use AssignableListing, HasNumber, HasUlids, Linkable;
    use BoundedReads;

    /**
     * The stable name links and assignments use for a plan.
     */
    public const string LINK_TYPE = 'plans.plan';

    /**
     * @var array<string, mixed>
     */
    protected $attributes = ['state' => 'planned'];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => PlanType::class,
            'state' => PlanState::class,
        ];
    }

    /**
     * Starts the plan; true when it changed, false when it was already started. Any other state refuses.
     */
    public function startOnce(): bool
    {
        if ($this->state === PlanState::Started) {
            return false;
        }

        if (! $this->state->canStart()) {
            throw StartDenied::inState($this->state->value);
        }

        $this->state = PlanState::Started;
        $this->save();

        return true;
    }

    /**
     * The phase with this number within the plan; a phase of another plan never answers.
     *
     * @throws PhaseMissing
     */
    public function phaseNumbered(int $number): Phase
    {
        return $this->phases()->where('number', $number)->first() ?? throw PhaseMissing::numbered($this->number, $number);
    }

    /**
     * Adds a phase after the last one, inside the caller's transaction.
     */
    public function addPhase(string $title): Phase
    {
        self::lockStructure($this->id);

        return $this->phases()->create(['title' => $title]);
    }

    /**
     * Locks a plan's row for update, so its phases and their tasks hold still until the transaction ends. Every change
     * of a plan's membership and every cascade over it takes this lock first; a future move between plans takes both
     * plans' locks in id order.
     */
    public static function lockStructure(string $planId): self
    {
        return self::query()->whereKey($planId)->lockForUpdate()->firstOrFail();
    }

    /**
     * Every task of the plan, phase by phase, in order.
     *
     * @return list<string>
     */
    public function taskIds(): array
    {
        $taskIds = PhaseTask::query()
            ->join('phases', 'phases.id', '=', 'phase_tasks.phase_id')
            ->where('phases.plan_id', $this->id)
            ->orderBy('phases.number')
            ->orderBy('phase_tasks.position')
            ->readAll('assignment and progress of a plan cover every task')
            ->pluck('phase_tasks.task_id')
            ->all();

        return array_map(strval(...), array_values($taskIds));
    }

    /**
     * The card of this plan from the progress of each phase, keyed by the phase's number. The current phase is the
     * first one with unfinished tasks, or the last phase once every task is done; a plan without phases has none.
     *
     * @param  array<int, PlanProgress>  $progressOfPhase
     * @param  Option<AssignmentHolder>  $holder
     * @param  bool  $focused  whether this is the plan the caller's stack works on now
     */
    public function card(array $progressOfPhase, Option $holder, bool $focused): PlanCard
    {
        $progress = array_reduce($progressOfPhase, fn (PlanProgress $sum, PlanProgress $phase) => $sum->plus($phase), PlanProgress::none());
        $unfinished = array_keys(array_filter($progressOfPhase, fn (PlanProgress $phase) => ! $phase->isComplete()));
        $currentPhase = $unfinished[0] ?? array_key_last($progressOfPhase);

        return new PlanCard($this->id, $this->number, $this->title, $this->type, $this->state, $this->state->canStart(), $focused, $progress, $currentPhase, $holder);
    }

    /**
     * The caller's current plan first when it has one, then the newest.
     *
     * @param  Builder<self>  $query
     * @param  Option<string>  $focusedPlanId
     */
    #[Scope]
    protected function listOrder(Builder $query, Option $focusedPlanId): void
    {
        $focusedPlanId->forAll(fn (string $id) => $query->orderByRaw('case when "plans"."id" = ? then 0 else 1 end', [$id]));
        $query->orderByDesc('id');
    }

    /**
     * @return HasMany<Phase, $this>
     */
    public function phases(): HasMany
    {
        return $this->hasMany(Phase::class)->orderBy('number');
    }

    public function assignmentIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::LINK_TYPE, $this->id);
    }
}
