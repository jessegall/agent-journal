<?php

declare(strict_types=1);

namespace App\Models\Drivers;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\Agents\ProcessStartState;
use App\Enums\Drivers\DriverSwitchStage;
use App\Enums\Drivers\DriverType;
use App\Events\Sessions\DriverSwitchCancelled;
use App\Events\Sessions\DriverSwitchConfirmed;
use App\Events\Sessions\DriverSwitchLaunchFailed;
use App\Events\Sessions\DriverSwitchPreflighted;
use App\Events\Sessions\DriverSwitchRefused;
use App\Events\Sessions\DriverSwitchStartRequested;
use App\Events\Sessions\DriverSwitchStopped;
use App\Events\Sessions\DriverSwitchStopRequested;
use App\Exceptions\DriverSwitchStageRefused;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Support\Accessor;
use App\Values\ChosenAccount;
use App\Values\DriverSwitchTarget;
use App\Values\PinnedDriver;
use Closure;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $request_id
 * @property string $agent_id
 * @property string $expected_session_id
 * @property int $expected_generation
 * @property string $target_driver_key
 * @property string $target_family
 * @property ?string $target_build
 * @property DriverType $driver_type
 * @property string $account_id
 * @property int $account_revision
 * @property ?string $conversation_id
 * @property bool $remember
 * @property string $requested_by
 * @property ?string $replacement_session_id
 * @property DriverSwitchStage $stage
 * @property ?int $stop_boundary_sequence
 * @property ?string $failure_reason
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property mixed $target attribute
 */
final class DriverSwitch extends Model implements EventSource, ReadableModel
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
            'driver_type' => DriverType::class,
            'expected_generation' => 'integer',
            'account_revision' => 'integer',
            'remember' => 'boolean',
            'stage' => DriverSwitchStage::class,
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * A requested switch of the agent away from the session and process generation it runs now.
     */
    public static function create(
        string $requestId,
        AgentSession $session,
        int $generation,
        DriverSwitchTarget $target,
        PinnedDriver $pin,
        string $requestedBy,
    ): self {
        $switch = new self();
        $switch->request_id = $requestId;
        $switch->agent_id = $session->agent_id;
        $switch->expected_session_id = $session->id;
        $switch->expected_generation = $generation;
        $switch->target_driver_key = (string) $pin->registration->key;
        $switch->target_family = $pin->registration->family;
        $switch->driver_type = $target->driverType;
        $switch->account_id = $target->account->accountId;
        $switch->account_revision = $target->account->reviewedSignIn;
        $switch->conversation_id = $target->conversationId;
        $switch->remember = $target->shouldSaveDriverType;
        $switch->requested_by = $requestedBy;
        $switch->stage = DriverSwitchStage::Requested;
        $switch->save();

        return $switch;
    }

    // ----------[ Mutations ]----------

    public function markPreflighted(): void
    {
        $this->moveTo(DriverSwitchStage::Preflighted);
        $this->raise(new DriverSwitchPreflighted($this->id));
    }

    public function refuse(string $reason): void
    {
        $this->moveTo(DriverSwitchStage::Refused, $reason);
        $this->raise(new DriverSwitchRefused($this->id, $reason));
    }

    /**
     * The source's stop was accepted: the switch keeps how far the source's observations had got, so only a later
     * observation can prove the source still runs.
     */
    public function beginStopping(AgentRuntime|null $source): void
    {
        $this->stop_boundary_sequence = $source?->observation_sequence;
        $this->moveTo(DriverSwitchStage::Stopping);
        $this->raise(new DriverSwitchStopRequested($this->id));
    }

    /**
     * The old session's process is proven gone; the replacement may start, once the commit lands.
     */
    public function markStopped(): void
    {
        $this->moveTo(DriverSwitchStage::Stopped);
        $this->raise(new DriverSwitchStopped($this->id));
    }

    /**
     * The replacement session was admitted and waits for its host to report it running.
     */
    public function beginStarting(string $sessionId): void
    {
        $this->replacement_session_id = $sessionId;
        $this->moveTo(DriverSwitchStage::Starting);
        $this->raise(new DriverSwitchStartRequested($this->id, $sessionId));
    }

    public function confirm(): void
    {
        $this->moveTo(DriverSwitchStage::Confirmed);
        $this->raise(new DriverSwitchConfirmed($this->id));
    }

    public function failLaunch(string $reason): void
    {
        $this->moveTo(DriverSwitchStage::LaunchFailed, $reason);
        $this->raise(new DriverSwitchLaunchFailed($this->id, $reason));
    }

    public function cancel(string|null $reason = null): void
    {
        $this->moveTo(DriverSwitchStage::Cancelled, $reason);
        $this->raise(new DriverSwitchCancelled($this->id, $reason));
    }

    /**
     * The owner retries a failed launch: the same request and target start again once the commit lands.
     */
    public function retryLaunch(): void
    {
        $this->replacement_session_id = null;
        $this->markStopped();
    }

    /**
     * A recheck of a stop or start that has no answer yet, from the process state the host last reported: without one
     * the switch is marked unconfirmed and waits; a proven stop moves on to the replacement, and an old process cancels
     * the switch only when it was observed running after its stop was accepted; a replacement that runs is confirmed
     * and one that ended failed.
     */
    public function recheck(ProcessStartState|null $reported, AgentRuntime|null $source): void
    {
        if ($this->stage === DriverSwitchStage::Stopping) {
            $this->moveTo(DriverSwitchStage::StopUnconfirmed);
        }

        if ($this->stage === DriverSwitchStage::Starting) {
            $this->moveTo(DriverSwitchStage::StartUnconfirmed);
        }

        $waitsForStop = $this->stage === DriverSwitchStage::StopUnconfirmed;
        $waitsForStart = $this->stage === DriverSwitchStage::StartUnconfirmed;

        match (true) {
            $waitsForStop && $reported === ProcessStartState::Stopped => $this->markStopped(),
            $waitsForStop
                && $reported === ProcessStartState::Running
                && $this->isSourceSeenAfterStop($source) => $this->cancel('the old session still runs'),
            $waitsForStart && $reported === ProcessStartState::Running => $this->confirm(),
            $waitsForStart && $reported === ProcessStartState::Stopped => $this->failLaunch('the new session ended'),
            default => null,
        };
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<DriverSwitchTarget, never>
     */
    protected function target(): Attribute
    {
        return Accessor::get(fn () => new DriverSwitchTarget(
            $this->target_family,
            $this->driver_type,
            new ChosenAccount($this->account_id, $this->account_revision),
            $this->conversation_id,
            $this->remember,
        ));
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses a move its present stage does not allow.
     *
     * @throws DriverSwitchStageRefused
     */
    private function assertMayMoveTo(DriverSwitchStage $next): void
    {
        if (! $this->stage->mayMoveTo($next)) {
            throw DriverSwitchStageRefused::from($this->stage, $next);
        }
    }

    // ----------[ Internals ]----------

    /**
     * Whether the source was observed running after its stop was accepted; without a boundary nothing proves it.
     */
    private function isSourceSeenAfterStop(AgentRuntime|null $source): bool
    {
        return $source !== null
            && $this->stop_boundary_sequence !== null
            && $source->isObservedRunningAfter($this->stop_boundary_sequence);
    }

    /**
     * @throws DriverSwitchStageRefused
     */
    private function moveTo(DriverSwitchStage $next, string|null $reason = null): void
    {
        $this->assertMayMoveTo($next);

        $this->stage = $next;
        $this->failure_reason = $reason;
        $this->assertSaved($this->save());
    }

    // ----------[ Queries ]----------

    public static function ofRequest(string $requestId): self|null
    {
        return self::query()->underRequest($requestId)->lockForUpdate()->first();
    }

    /**
     * The open switch waiting for the stop of this session, locked.
     */
    public static function stoppingOf(string $sessionId): self|null
    {
        return self::query()
            ->stoppingSession($sessionId)
            ->lockForUpdate()
            ->first();
    }

    /**
     * The open switch waiting for this replacement session to run, locked.
     */
    public static function startingOf(string $sessionId): self|null
    {
        return self::query()
            ->startingSession($sessionId)
            ->lockForUpdate()
            ->first();
    }

    /**
     * The agent's switch that has not ended, locked; the caller holds the agent's lifecycle lock first.
     */
    public static function openOf(string $agentId): self|null
    {
        return self::query()
            ->ofAgent($agentId)
            ->unfinished()
            ->lockForUpdate()
            ->first();
    }

    // ----------[ Scopes ]----------

    /**
     * The switch made under the request.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function underRequest(Builder $query, string $requestId): void
    {
        $query->where('request_id', $requestId);
    }

    /**
     * The switch that is stopping the session.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function stoppingSession(Builder $query, string $sessionId): void
    {
        $query->where('expected_session_id', $sessionId)
            ->whereIn('stage', [
                DriverSwitchStage::Stopping->value,
                DriverSwitchStage::StopUnconfirmed->value,
            ]);
    }

    /**
     * The switch that is starting the session.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function startingSession(Builder $query, string $sessionId): void
    {
        $query->where('replacement_session_id', $sessionId)
            ->whereIn('stage', [
                DriverSwitchStage::Starting->value,
                DriverSwitchStage::StartUnconfirmed->value,
            ]);
    }

    /**
     * The agent's switches.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofAgent(Builder $query, string $agentId): void
    {
        $query->where('agent_id', $agentId);
    }

    /**
     * The switches not in a final stage.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unfinished(Builder $query): void
    {
        $finals = array_filter(DriverSwitchStage::cases(), fn (DriverSwitchStage $stage) => $stage->isFinal());
        $query->whereNotIn('stage', array_map(fn (DriverSwitchStage $stage) => $stage->value, $finals));
    }

    /**
     * The rows of any of the given agents.
     *
     * @param  Builder<self>  $query
     * @param  array<array-key, string>|Builder<covariant Model>|Closure  $agentIds
     */
    #[Scope]
    protected function ofAgents(Builder $query, array|Builder|Closure $agentIds): void
    {
        $query->whereIn('agent_id', $agentIds);
    }

    /**
     * The rows by created at descending.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function newestCreatedFirst(Builder $query): void
    {
        $query->orderByDesc('created_at');
    }
}
