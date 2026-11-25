<?php

declare(strict_types=1);

namespace App\Models\Drivers;

use App\Casts\NavigationScreenCast;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Assignments\Assignable;
use App\Contracts\Records\ReadableModel;
use App\Enums\NavigationCompletion;
use App\Enums\NavigationReason;
use App\Enums\NavigationState;
use App\Exceptions\NavigationTransitionRefused;
use App\Models\Agents\AgentRuntime;
use App\Models\Support\Accessor;
use App\Models\Support\BelongsToOneActor;
use App\Models\Support\HasActorColumns;
use App\Support\ActorIdentity;
use App\Support\RecordIdentity;
use App\Values\NavigationScreen;
use App\Values\NavigationUncertainty;
use App\Values\ScriptGoal;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A key script run that could not be certain, put to the main agent: the stalled driver request and its runtime,
 * the goal, why it stalled, the screen it is on and where the conversation stands. It belongs to
 * the user whose agent runs the script; the main agent's rounds are driver requests of their own.
 *
 * @property string $id
 * @property string $driver_request_id
 * @property string $agent_runtime_id
 * @property string $operation_key
 * @property string $actor_type
 * @property string $actor_id
 * @property string $family
 * @property string $build
 * @property string $fingerprint
 * @property string $goal_script
 * @property int $goal_version
 * @property array<string, string> $goal_parameters
 * @property string $goal_key
 * @property int $stalled_step
 * @property NavigationReason $reason
 * @property NavigationScreen $screen
 * @property list<string> $raise_rows
 * @property list<string> $sent_steps
 * @property NavigationState $state
 * @property NavigationCompletion|null $completes
 * @property int|null $next_step
 * @property string|null $proof
 * @property string|null $abandon_reason
 * @property string|null $stale_entry_id
 * @property string|null $library_entry_id
 * @property CarbonImmutable $expires_at
 * @property int $row_version
 */
#[Fillable([
    'agent_runtime_id',
    'driver_request_id',
    'operation_key',
    'family',
    'build',
    'goal_script',
    'goal_version',
    'goal_parameters',
    'goal_key',
    'completes',
    'proof',
    'fingerprint',
    'screen',
    'raise_rows',
    'stalled_step',
    'next_step',
    'sent_steps',
    'library_entry_id',
    'stale_entry_id',
    'state',
    'reason',
    'abandon_reason',
    'expires_at',
])]
final class NavigationRequest extends Model implements Assignable, ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasActorColumns;
    use HasUlids;
    use Linkable;

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
            'screen' => NavigationScreenCast::class,
            'raise_rows' => 'array',
            'sent_steps' => 'array',
            'state' => NavigationState::class,
            'completes' => NavigationCompletion::class,
            'expires_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * The request the host raised for a stalled key script, open for the main agent; the same raise sent again by
     * the host, under the same operation key, is the request it raised before.
     */
    public static function create(
        DriverRequest $request,
        ActorIdentity $owner,
        NavigationUncertainty $uncertainty,
        string $operationKey,
        CarbonImmutable $expiresAt,
    ): self {
        $raisedBefore = self::raisedForOperation($request->agent_runtime_id, $operationKey);

        if ($raisedBefore !== null) {
            return $raisedBefore;
        }

        $goal = $request->scriptGoal();
        $navigation = new self();
        $navigation->driver_request_id = $request->id;
        $navigation->agent_runtime_id = $request->agent_runtime_id;
        $navigation->operation_key = $operationKey;
        $navigation->family = $request->runtime->family;
        $navigation->build = $request->runtime->driver_build;
        $navigation->fingerprint = $uncertainty->fingerprint;
        $navigation->goal_script = $goal->script;
        $navigation->goal_version = $goal->version;
        $navigation->goal_parameters = $goal->parameters;
        $navigation->goal_key = $goal->key();
        $navigation->stalled_step = $uncertainty->stalledStep;
        $navigation->reason = $uncertainty->reason;
        $navigation->screen = $uncertainty->screen;
        $navigation->raise_rows = $uncertainty->screen->rows;
        $navigation->stale_entry_id = $uncertainty->staleEntryId;
        $navigation->sent_steps = $uncertainty->sentSteps;
        $navigation->state = NavigationState::Open;
        $navigation->expires_at = $expiresAt;
        $navigation->belongTo($owner);
        $navigation->save();

        return $navigation;
    }

    // ----------[ Mutations ]----------

    /**
     * The proven path was saved as the menu entry.
     */
    public function savedAs(MenuEntry $entry): void
    {
        $this->library_entry_id = $entry->id;
        $this->change();
    }

    /**
     * The host reports the stable screen after a round: it is the request's current screen from now on.
     */
    public function showScreen(NavigationScreen $screen): void
    {
        $this->screen = $screen;
        $this->change();
    }

    /**
     * The main agent sends a round: the first one opens the conversation, a later one goes on with it.
     */
    public function answer(): void
    {
        if ($this->isAnswering()) {
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
     * The main agent gives up, saying why; the runtime keeps its hold for the user.
     */
    public function abandon(string $reason): void
    {
        $this->abandon_reason = $reason;
        $this->moveTo(NavigationState::Abandoned);
    }

    /**
     * The user typed, or the screen changed with no round sent.
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

    // ----------[ Predicates ]----------

    /**
     * Whether the main agent is answering the request, the one state in which a proof may be given.
     */
    public function isAnswering(): bool
    {
        return $this->state === NavigationState::Answering;
    }

    public function isAtRowVersion(int $version): bool
    {
        return $this->row_version === $version;
    }

    // ----------[ Transformers ]----------

    public function assignmentIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::linkType(), $this->id);
    }

    // ----------[ Accessors ]----------

    /**
     * The key script the request navigates for, with its version and parameters.
     *
     * @return Attribute<ScriptGoal, never>
     */
    protected function goal(): Attribute
    {
        return Accessor::get(fn () => new ScriptGoal($this->goal_script, $this->goal_version, $this->goal_parameters));
    }

    // ----------[ Relations ]----------

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

    // ----------[ Asserts ]----------

    /**
     * Refuses a move its present state does not allow.
     *
     * @throws NavigationTransitionRefused
     */
    private function assertMayMoveTo(NavigationState $next): void
    {
        if (! $this->state->canMoveTo($next)) {
            throw NavigationTransitionRefused::from($this->state, $next);
        }
    }

    // ----------[ Internals ]----------

    private function moveTo(NavigationState $next): void
    {
        $this->assertMayMoveTo($next);

        $this->state = $next;
        $this->change();
    }

    private function change(): void
    {
        $this->row_version++;
        $this->save();
    }

    // ----------[ Queries ]----------

    public static function raisedForOperation(string $runtimeId, string $operationKey): self|null
    {
        return self::query()->acrossActors()
            ->forOperation($runtimeId, $operationKey)
            ->first();
    }

    public static function isSameMenuOpenElsewhere(
        ActorIdentity $owner,
        AgentRuntime $runtime,
        ScriptGoal $goal,
        string $fingerprint,
    ): bool {
        return self::query()->ownedBy($owner)->open()
            ->onOtherRuntimeOfBuild($runtime)
            ->forMenu($fingerprint, $goal)
            ->exists();
    }

    // ----------[ Scopes ]----------

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

    /**
     * The request raised for the runtime's operation.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forOperation(Builder $query, string $runtimeId, string $operationKey): void
    {
        $query->where('agent_runtime_id', $runtimeId)->where('operation_key', $operationKey);
    }

    /**
     * The requests of other runtimes of the runtime's driver family and build.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function onOtherRuntimeOfBuild(Builder $query, AgentRuntime $runtime): void
    {
        $query->where('agent_runtime_id', '!=', $runtime->id)
            ->where('family', $runtime->family)
            ->where('build', $runtime->driver_build);
    }

    /**
     * The requests for the menu of that fingerprint and goal.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forMenu(Builder $query, string $fingerprint, ScriptGoal $goal): void
    {
        $query->where('fingerprint', $fingerprint)->where('goal_key', $goal->key());
    }

    /**
     * The rows of any of the given states.
     *
     * @param  Builder<self>  $query
     * @param  list<NavigationState>  $states
     */
    #[Scope]
    protected function withAnyState(Builder $query, array $states): void
    {
        $query->whereIn('state', $states);
    }

    /**
     * The rows of the given driver request.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofDriverRequest(Builder $query, string $driverRequestId): void
    {
        $query->where('driver_request_id', $driverRequestId);
    }

    /**
     * The rows of any of the given ids.
     *
     * @param  Builder<self>  $query
     * @param  list<string>  $ids
     */
    #[Scope]
    protected function withAnyId(Builder $query, array $ids): void
    {
        $query->whereIn('id', $ids);
    }
}
