<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Actors\Enums\ActorType;
use App\Actors\Models\Support\BelongsToOneActor;
use App\Actors\Support\ActorIdentity;
use App\Agents\Enums\NavigationCompletion;
use App\Agents\Enums\NavigationReason;
use App\Agents\Enums\NavigationState;
use App\Agents\Enums\RequestProgress;
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
use Illuminate\Database\Eloquent\Attributes\Fillable;
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
 * @property string $actor_type
 * @property string $actor_id
 * @property string $program
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
    'program',
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
            'sent_steps' => 'array',
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
        $raisedBefore = self::raisedForOperation($request->agent_runtime_id, $operationKey);
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

    public static function raisedForOperation(string $runtimeId, string $operationKey): self|null
    {
        return self::query()->acrossActors()
            ->where('agent_runtime_id', $runtimeId)
            ->where('operation_key', $operationKey)
            ->first();
    }

    public static function isSameMenuOpenElsewhere(
        ActorIdentity $owner,
        AgentRuntime $runtime,
        ScriptGoal $goal,
        string $fingerprint,
    ): bool {
        return self::query()->ownedBy($owner)->open()
            ->where('agent_runtime_id', '!=', $runtime->id)
            ->where('program', $runtime->program)
            ->where('build', $runtime->program_build)
            ->where('fingerprint', $fingerprint)
            ->where('goal_key', $goal->key())
            ->exists();
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

    /**
     * The user the request belongs to.
     */
    public function owner(): ActorIdentity
    {
        return new ActorIdentity(ActorType::from($this->actor_type), $this->actor_id);
    }

    /**
     * The proven path was saved as the menu entry.
     */
    public function savedAs(MenuEntry $entry): void
    {
        $this->library_entry_id = $entry->id;
        $this->change();
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

    /**
     * Whether the main agent is answering the request, the one state in which a proof may be given.
     */
    public function isAnswering(): bool
    {
        return $this->state === NavigationState::Answering;
    }

    public function isAtRowVersion(int $rowVersion): bool
    {
        return $this->row_version === $rowVersion;
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
        $this->cancelQueuedRounds();
    }

    /**
     * The user typed, or the screen changed with no round sent.
     */
    public function interrupt(): void
    {
        $this->moveTo(NavigationState::Interrupted);
        $this->cancelQueuedRounds();
    }

    /**
     * The driver request was cancelled, the runtime stopped or the session ended.
     */
    public function cancel(): void
    {
        $this->moveTo(NavigationState::Cancelled);
        $this->cancelQueuedRounds();
    }

    /**
     * Nobody answered in time.
     */
    public function expire(): void
    {
        $this->moveTo(NavigationState::Expired);
        $this->cancelQueuedRounds();
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

    /**
     * Cancels the main agent's rounds that have not reached the host yet: the request they answer has ended.
     */
    private function cancelQueuedRounds(): void
    {
        $queued = DriverRequest::query()
            ->where('navigation_request_id', $this->id)
            ->whereIn('progress', [RequestProgress::Accepted, RequestProgress::Staged])
            ->lockForUpdate()
            ->readLimit(20)
            ->get();
        foreach ($queued as $round) {
            $round->cancel();
        }
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
