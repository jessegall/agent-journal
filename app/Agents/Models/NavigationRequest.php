<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Actors\Models\Support\BelongsToOneActor;
use App\Actors\Support\ActorIdentity;
use App\Agents\Enums\NavigationCompletion;
use App\Agents\Enums\NavigationReason;
use App\Agents\Enums\NavigationState;
use App\Agents\Exceptions\NavigationTransitionRefused;
use App\Agents\Values\NavigationScreen;
use App\Agents\Values\NavigationUncertainty;
use App\Agents\Values\ScriptGoal;
use App\Assignments\Contracts\Assignable;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Records\Support\RecordIdentity;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A key script run that could not be certain, put to the main agent: the stalled driver request and its runtime,
 * the goal, why it stalled, the screen it is on and where the conversation stands (doc 54, section 5). It belongs to
 * the user whose agent runs the script; the main agent's rounds are driver requests of their own.
 *
 * @property string $id
 * @property string $driver_request_id
 * @property string $agent_runtime_id
 * @property string $operation_key
 * @property string $program
 * @property string $build
 * @property string $fingerprint
 * @property string $goal_script
 * @property int $goal_version
 * @property array<string, string> $goal_parameters
 * @property int $stalled_step
 * @property NavigationReason $reason
 * @property NavigationScreen $screen
 * @property list<string> $raise_rows
 * @property NavigationState $state
 * @property NavigationCompletion|null $completes
 * @property int|null $next_step
 * @property string|null $proof
 * @property string|null $stale_entry_id
 * @property string|null $library_entry_id
 * @property CarbonImmutable $expires_at
 * @property int $row_version
 */
final class NavigationRequest extends Model implements Assignable, ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public const string LINK_TYPE = 'core.navigation-request';

    /**
     * @var array<string, mixed>
     */
    protected $attributes = ['row_version' => 1];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'goal_parameters' => 'array',
            'reason' => NavigationReason::class,
            'screen' => NavigationScreen::class,
            'raise_rows' => 'array',
            'state' => NavigationState::class,
            'completes' => NavigationCompletion::class,
            'expires_at' => 'immutable_datetime',
        ];
    }

    /**
     * The request the host raised for a stalled key script, open for the main agent; the same raise sent again by
     * the host, under the same operation key, is the request it raised before.
     */
    public static function raised(
        DriverRequest $request,
        ActorIdentity $owner,
        NavigationUncertainty $uncertainty,
        string $operationKey,
        CarbonImmutable $expiresAt,
    ): self {
        $raisedBefore = self::query()
            ->acrossActors()
            ->where('agent_runtime_id', $request->agent_runtime_id)
            ->where('operation_key', $operationKey)
            ->first();
        if ($raisedBefore !== null) {
            return $raisedBefore;
        }

        $goal = $request->scriptGoal();
        $navigation = new self();
        $navigation->driver_request_id = $request->id;
        $navigation->agent_runtime_id = $request->agent_runtime_id;
        $navigation->operation_key = $operationKey;
        $navigation->program = $request->runtime->program;
        $navigation->build = $request->runtime->program_build;
        $navigation->fingerprint = $uncertainty->fingerprint;
        $navigation->goal_script = $goal->script;
        $navigation->goal_version = $goal->version;
        $navigation->goal_parameters = $goal->parameters;
        $navigation->stalled_step = $uncertainty->stalledStep;
        $navigation->reason = $uncertainty->reason;
        $navigation->screen = $uncertainty->screen;
        $navigation->raise_rows = $uncertainty->screen->rows;
        $navigation->state = NavigationState::Open;
        $navigation->expires_at = $expiresAt;
        $navigation->belongTo($owner);
        $navigation->save();

        return $navigation;
    }

    /**
     * @return BelongsTo<DriverRequest, $this>
     */
    public function driverRequest(): BelongsTo
    {
        return $this->belongsTo(DriverRequest::class);
    }

    /**
     * @return BelongsTo<AgentRuntime, $this>
     */
    public function runtime(): BelongsTo
    {
        return $this->belongsTo(AgentRuntime::class, 'agent_runtime_id');
    }

    /**
     * Cancels the open navigation request of a driver request that was cancelled or ended with its runtime, in the
     * same transaction; a driver request with none is left as it is.
     */
    public static function cancelOpenFor(DriverRequest $request): void
    {
        $open = self::query()
            ->acrossActors()
            ->open()
            ->where('driver_request_id', $request->id)
            ->lockForUpdate()
            ->first();
        $open?->cancel();
    }

    public function assignmentIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::LINK_TYPE, $this->id);
    }

    /**
     * The key script the request navigates for, with its version and parameters.
     */
    public function goal(): ScriptGoal
    {
        return new ScriptGoal($this->goal_script, $this->goal_version, $this->goal_parameters);
    }

    public function isAtRowVersion(int $rowVersion): bool
    {
        return $this->row_version === $rowVersion;
    }

    /**
     * The main agent sends a round: the first one opens the conversation, a later one goes on with it.
     */
    public function answer(): void
    {
        if ($this->state === NavigationState::Answering) {
            $this->change();

            return;
        }

        $this->moveTo(NavigationState::Answering);
    }

    /**
     * The main agent says it is done and names the text that proves it, for the goal or only for the stalled step.
     */
    public function prove(NavigationCompletion $completes, int|null $nextStep, string $proof): void
    {
        $this->completes = $completes;
        $this->next_step = $nextStep;
        $this->proof = $proof;
        $this->moveTo(NavigationState::Proving);
    }

    /**
     * The host did not see the proof, so the main agent may go on answering.
     */
    public function refuseProof(): void
    {
        $this->completes = null;
        $this->next_step = null;
        $this->proof = null;
        $this->moveTo(NavigationState::Answering);
    }

    /**
     * The host saw the proof on the screen.
     */
    public function markProven(): void
    {
        $this->moveTo(NavigationState::Proven);
    }

    /**
     * The main agent gives up; the runtime keeps its hold for the person.
     */
    public function abandon(): void
    {
        $this->moveTo(NavigationState::Abandoned);
    }

    /**
     * The person typed, or the screen changed with no round sent.
     */
    public function interrupt(): void
    {
        $this->moveTo(NavigationState::Interrupted);
    }

    /**
     * The driver request was cancelled, the runtime stopped or the session ended.
     */
    public function cancel(): void
    {
        $this->moveTo(NavigationState::Cancelled);
    }

    /**
     * Nobody answered in time.
     */
    public function expire(): void
    {
        $this->moveTo(NavigationState::Expired);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function open(Builder $query): void
    {
        $query->whereIn('state', NavigationState::openStates());
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forRuntime(Builder $query, AgentRuntime $runtime): void
    {
        $query->where('agent_runtime_id', $runtime->id);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function expiredBefore(Builder $query, CarbonImmutable $moment): void
    {
        $query->where('expires_at', '<', $moment);
    }

    private function moveTo(NavigationState $next): void
    {
        if (! $this->state->canMoveTo($next)) {
            throw NavigationTransitionRefused::from($this->state, $next);
        }

        $this->state = $next;
        $this->change();
    }

    private function change(): void
    {
        $this->row_version++;
        $this->save();
    }
}
