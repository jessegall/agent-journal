<?php

declare(strict_types=1);

namespace App\Models\Drivers;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Assignments\Assignable;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\Navigation\NavigationCompletion;
use App\Enums\Navigation\NavigationReason;
use App\Enums\Navigation\NavigationStatus;
use App\Events\Sessions\NavigationRequestAbandoned;
use App\Events\Sessions\NavigationRequestAnswered;
use App\Events\Sessions\NavigationRequestCancelled;
use App\Events\Sessions\NavigationRequestExpired;
use App\Events\Sessions\NavigationRequestInterrupted;
use App\Events\Sessions\NavigationRequestProofGiven;
use App\Events\Sessions\NavigationRequestProofRefused;
use App\Events\Sessions\NavigationRequestProven;
use App\Events\Sessions\NavigationRequestSaved;
use App\Events\Sessions\NavigationRequestScreenShown;
use App\Exceptions\NavigationTransitionRefused;
use App\Models\Agents\AgentRuntime;
use App\Models\Support\Accessor;
use App\Models\Support\BelongsToOneActor;
use App\Models\Support\HasActorColumns;
use App\Support\ActorReference;
use App\Support\RecordIdentity;
use App\Values\NavigationScreen;
use App\Values\NavigationUncertainty;
use App\Values\ScriptGoal;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
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
 * @property array<string,string> $goal_parameters
 * @property string $goal_key
 * @property int $stalled_step
 * @property NavigationReason $reason
 * @property NavigationScreen $screen
 * @property list<string> $raise_rows
 * @property NavigationStatus $status
 * @property NavigationCompletion|null $completes
 * @property int|null $next_step
 * @property string|null $proof
 * @property string|null $abandon_reason
 * @property string|null $stale_entry_id
 * @property list<string> $sent_steps
 * @property string|null $library_entry_id
 * @property CarbonImmutable $expires_at
 * @property int $row_version
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read DriverRequest|null $driverRequest
 * @property-read mixed $goal
 * @property-read AgentRuntime|null $runtime
 *
 * @mixin \Eloquent
 */
final class NavigationRequest extends Model implements Assignable, EventSource, ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasActorColumns;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = ['row_version' => 1];

    /**
     * @return array<string, string>
     *
     * @column goal_parameters array<string,string>
     * @column raise_rows list<string>
     * @column sent_steps list<string>
     */
    protected function casts(): array
    {
        return [
            'goal_parameters' => 'array',
            'reason' => NavigationReason::class,
            'screen' => NavigationScreen::class,
            'raise_rows' => 'array',
            'sent_steps' => 'array',
            'status' => NavigationStatus::class,
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
        ActorReference $owner,
        NavigationUncertainty $uncertainty,
        string $operationKey,
        CarbonImmutable $expiresAt,
    ): self {
        $raisedBefore = self::findRaisedForOperation($request->agent_runtime_id, $operationKey);

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
        $navigation->status = NavigationStatus::Open;
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
        $this->raise(new NavigationRequestSaved($this->id));
    }

    /**
     * The host reports the stable screen after a round: it is the request's current screen from now on.
     */
    public function showScreen(NavigationScreen $screen): void
    {
        $this->screen = $screen;
        $this->change();
        $this->raise(new NavigationRequestScreenShown($this->id));
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

        $this->moveTo(NavigationStatus::Answering);
        $this->raise(new NavigationRequestAnswered($this->id));
    }

    /**
     * The main agent says it is done and names the text that proves it, for the goal or only for the stalled step.
     */
    public function prove(NavigationCompletion $completes, int|null $nextStep, string $proof): void
    {
        $this->completes = $completes;
        $this->next_step = $nextStep;
        $this->proof = $proof;
        $this->moveTo(NavigationStatus::Proving);
        $this->raise(new NavigationRequestProofGiven($this->id));
    }

    /**
     * The host did not see the proof, so the main agent may go on answering.
     */
    public function refuseProof(): void
    {
        $this->completes = null;
        $this->next_step = null;
        $this->proof = null;
        $this->moveTo(NavigationStatus::Answering);
        $this->raise(new NavigationRequestProofRefused($this->id));
    }

    /**
     * The host saw the proof on the screen.
     */
    public function markProven(): void
    {
        $this->moveTo(NavigationStatus::Proven);
        $this->raise(new NavigationRequestProven($this->id));
    }

    /**
     * The main agent gives up, saying why; the runtime keeps its hold for the user.
     */
    public function abandon(string $reason): void
    {
        $this->abandon_reason = $reason;
        $this->moveTo(NavigationStatus::Abandoned);
        $this->raise(new NavigationRequestAbandoned($this->id));
    }

    /**
     * The user typed, or the screen changed with no round sent.
     */
    public function interrupt(): void
    {
        $this->moveTo(NavigationStatus::Interrupted);
        $this->raise(new NavigationRequestInterrupted($this->id));
    }

    /**
     * The driver request was cancelled, the runtime stopped or the session ended.
     */
    public function cancel(): void
    {
        $this->moveTo(NavigationStatus::Cancelled);
        $this->raise(new NavigationRequestCancelled($this->id));
    }

    /**
     * Nobody answered in time.
     */
    public function expire(): void
    {
        $this->moveTo(NavigationStatus::Expired);
        $this->raise(new NavigationRequestExpired($this->id));
    }

    // ----------[ Predicates ]----------

    /**
     * Whether the main agent is answering the request, the one state in which a proof may be given.
     */
    public function isAnswering(): bool
    {
        return $this->status === NavigationStatus::Answering;
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
    private function assertMayMoveTo(NavigationStatus $next): void
    {
        if (! $this->status->canMoveTo($next)) {
            throw NavigationTransitionRefused::from($this->status, $next);
        }
    }

    // ----------[ Internals ]----------

    private function moveTo(NavigationStatus $next): void
    {
        $this->assertMayMoveTo($next);

        $this->status = $next;
        $this->change();
    }

    private function change(): void
    {
        $this->row_version++;
        $this->save();
    }

    // ----------[ Queries ]----------

    public static function findRaisedForOperation(string $runtimeId, string $operationKey): self|null
    {
        return self::query()->acrossActors()
            ->forOperation($runtimeId, $operationKey)
            ->first();
    }

    public static function isSameMenuOpenElsewhere(
        ActorReference $owner,
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
        $query->whereIn('status', NavigationStatus::openStates());
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
     * @param  array<array-key, NavigationStatus>|Builder<covariant Model>|Closure  $states
     */
    #[Scope]
    protected function withAnyState(Builder $query, array|Builder|Closure $states): void
    {
        $query->whereIn('status', $states);
    }

    /**
     * The rows of the given driver request.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofDriverRequest(Builder $query, string $requestId): void
    {
        $query->where('driver_request_id', $requestId);
    }

    /**
     * The rows of any of the given ids.
     *
     * @param  Builder<self>  $query
     * @param  array<array-key, string>|Builder<covariant Model>|Closure  $ids
     */
    #[Scope]
    protected function withAnyId(Builder $query, array|Builder|Closure $ids): void
    {
        $query->whereIn('id', $ids);
    }

    /**
     * The rows with their driverRequest and runtime loaded.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withDriverRequestAndRuntime(Builder $query): void
    {
        $query->with([
            'driverRequest',
            'runtime',
        ]);
    }

    /**
     * The rows with their driverRequest loaded.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withDriverRequest(Builder $query): void
    {
        $query->with('driverRequest');
    }
}
