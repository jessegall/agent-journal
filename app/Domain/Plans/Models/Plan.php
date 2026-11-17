<?php

declare(strict_types=1);

namespace App\Domain\Plans\Models;

use App\Core\Assignments\Models\Support\AssignableListing;
use App\Core\Assignments\Support\AssignmentHolder;
use App\Core\Assignments\Support\RecordIdentity;
use App\Core\Assignments\Contracts\Assignable;
use App\Core\Links\Support\Linkable;
use App\Domain\Plans\Api\PlanCard;
use App\Domain\Plans\Api\PlanProgress;
use App\Domain\Plans\Enums\PlanKind;
use App\Domain\Plans\Enums\PlanState;
use App\Domain\Plans\Exceptions\StartDenied;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use PhpOption\Option;

/**
 * A goal with phases in order and the tasks in each phase. Every agent and the owner read every plan, so it has no
 * agent limit (rule 4, message 519).
 *
 * @property int $id
 * @property string $title
 * @property PlanKind $kind
 * @property PlanState $state
 * @property bool $focused
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['title', 'kind'])]
final class Plan extends Model implements Assignable
{
    use AssignableListing, Linkable;

    /**
     * The stable name links and assignments use for a plan.
     */
    public const string LINK_TYPE = 'plans.plan';

    /**
     * @var array<string, mixed>
     */
    protected $attributes = ['state' => 'planned', 'focused' => false];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'kind' => PlanKind::class,
            'state' => PlanState::class,
            'focused' => 'boolean',
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
     * Adds a phase after the last one.
     */
    public function addPhase(string $title): Phase
    {
        return $this->getConnection()->transaction(function () use ($title): Phase {
            self::lockStructure($this->id);

            return $this->phases()->create(['title' => $title, 'position' => $this->phases()->count() + 1]);
        });
    }

    /**
     * Locks a plan's row for update, so its phases and their tasks hold still until the transaction ends. Every change
     * of a plan's membership and every cascade over it takes this lock first; a future move between plans takes both
     * plans' locks in id order.
     */
    public static function lockStructure(int $planId): self
    {
        return self::query()->whereKey($planId)->lockForUpdate()->firstOrFail();
    }

    /**
     * Every task of the plan, phase by phase, in order.
     *
     * @return list<int>
     */
    public function taskIds(): array
    {
        $taskIds = PhaseTask::query()
            ->join('phases', 'phases.id', '=', 'phase_tasks.phase_id')
            ->where('phases.plan_id', $this->id)
            ->orderBy('phases.position')
            ->orderBy('phase_tasks.position')
            ->pluck('phase_tasks.task_id')
            ->all();

        return array_map(intval(...), array_values($taskIds));
    }

    /**
     * The card of this plan from the progress of each phase, keyed by the phase's position. The current phase is the
     * first one with unfinished tasks, or the last phase once every task is done; a plan without phases has none.
     *
     * @param  array<int, PlanProgress>  $progressOfPhase
     * @param  Option<AssignmentHolder>  $holder
     */
    public function card(array $progressOfPhase, Option $holder): PlanCard
    {
        $progress = array_reduce($progressOfPhase, fn (PlanProgress $sum, PlanProgress $phase) => $sum->plus($phase), PlanProgress::none());
        $unfinished = array_keys(array_filter($progressOfPhase, fn (PlanProgress $phase) => ! $phase->isComplete()));
        $currentPhase = $unfinished[0] ?? array_key_last($progressOfPhase);

        return new PlanCard($this->id, $this->title, $this->kind, $this->state, $this->state->canStart(), $this->focused, $progress, $currentPhase, $holder);
    }

    /**
     * The focused plan first, then the newest.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function listOrder(Builder $query): void
    {
        $query->orderByDesc('focused')->orderByDesc('id');
    }

    /**
     * @return HasMany<Phase, $this>
     */
    public function phases(): HasMany
    {
        return $this->hasMany(Phase::class)->orderBy('position');
    }

    public function assignmentIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::LINK_TYPE, $this->id);
    }
}
