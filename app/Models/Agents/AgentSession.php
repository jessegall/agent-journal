<?php

declare(strict_types=1);

namespace App\Models\Agents;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\Accounts\AccountProcessRole;
use App\Enums\Agents\WorkspaceUse;
use App\Enums\Drivers\DriverSourceType;
use App\Enums\Sessions\ModelSelectionType;
use App\Enums\Sessions\SessionStatus;
use App\Events\Sessions\AgentSessionConversationEntered;
use App\Events\Sessions\AgentSessionDriverLabelKept;
use App\Events\Sessions\AgentSessionEnded;
use App\Events\Sessions\AgentSessionHeartbeatRecorded;
use App\Events\Sessions\AgentSessionSelectionUsed;
use App\Events\Sessions\AgentSessionSkillsGenerated;
use App\Exceptions\SessionSelectionFixed;
use App\Models\Drivers\ConversationVisit;
use App\Models\Drivers\DriverConversation;
use App\Models\Sessions\SessionRequest;
use App\Models\Sessions\SessionToken;
use App\Models\Support\Accessor;
use App\Support\PresenceWindow;
use App\Support\RecordIdentity;
use App\Values\AccessPolicy;
use App\Values\AccountUse;
use App\Values\ModelSelection;
use App\Values\SelectedDriver;
use App\Values\SelectionSource;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $agent_id
 * @property ?string $parent_session_id
 * @property ?string $driver_key
 * @property ?string $driver_label
 * @property ?string $driver_build
 * @property string $model
 * @property ModelSelectionType $requested_model_type
 * @property ?string $requested_model
 * @property DriverSourceType $driver_source
 * @property string $profile_key
 * @property int $profile_revision
 * @property string $start_request_id
 * @property ?string $skill_generation_id
 * @property ?string $current_conversation_id
 * @property ?string $selected_message_id
 * @property ?string $job_source_message_id
 * @property SessionStatus $status
 * @property ?CarbonImmutable $ended_at
 * @property ?CarbonImmutable $last_heartbeat_at
 * @property ?CarbonImmutable $silent_since
 * @property ?string $end_evidence
 * @property ?CarbonImmutable $discovered_at
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property mixed $selection attribute
 * @property mixed $target attribute
 * @property Agent $agent
 * @property ?DriverConversation $currentConversation
 * @property SessionToken $sessionToken
 * @property Collection<int, ConversationVisit>|ConversationVisit[] $visits
 */
final class AgentSession extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use OrdersById;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => SessionStatus::class,
            'ended_at' => 'immutable_datetime',
            'last_heartbeat_at' => 'immutable_datetime',
            'silent_since' => 'immutable_datetime',
            'discovered_at' => 'immutable_datetime',
            'requested_model_type' => ModelSelectionType::class,
            'driver_source' => DriverSourceType::class,
            'profile_revision' => 'integer',
        ];
    }

    // ----------[ Mutations ]----------

    /**
     * Records the selection and the start request once; a session never changes the driver or model it ran.
     *
     * @throws SessionSelectionFixed
     */
    public function useSelection(SelectedDriver $selection, string $requestId): void
    {
        $this->assertSelectionOpen();

        $this->driver_key = $selection->driver;
        $this->model = $selection->model;
        $this->requested_model_type = $selection->requested->type;
        $this->requested_model = $selection->requested->model;
        $this->driver_source = $selection->source->driverSource;
        $this->profile_key = $selection->source->profileKey;
        $this->profile_revision = $selection->source->profileRevision;
        $this->start_request_id = $requestId;
        $this->assertSaved($this->save());
        $this->raise(new AgentSessionSelectionUsed($this->id, $requestId));
    }

    /**
     * Records the skill generation the session's driver was spawned with.
     */
    public function recordSkillGeneration(string $generationId): void
    {
        $this->skill_generation_id = $generationId;
        $this->assertSaved($this->save());
        $this->raise(new AgentSessionSkillsGenerated($this->id, $generationId));
    }

    public function enterConversation(DriverConversation $conversation): void
    {
        $this->current_conversation_id = $conversation->id;
        $this->assertSaved($this->save());
        $this->raise(new AgentSessionConversationEntered($this->id));
    }

    /**
     * Keeps the label of the driver the session was pinned to at start, which it shows for good, even after that
     * registration is gone.
     */
    public function keepDriverLabel(string $label): void
    {
        $this->driver_label = $label;
        $this->assertSaved($this->save());
        $this->raise(new AgentSessionDriverLabelKept($this->id, $label));
    }

    public function endAt(CarbonImmutable $time): void
    {
        $this->status = SessionStatus::Ended;
        $this->ended_at = $time;
        $this->assertSaved($this->save());
        $this->raise(new AgentSessionEnded($this->id));
    }

    /**
     * A sign of life from the host: a silent session is active again.
     */
    public function recordHeartbeatAt(CarbonImmutable $time): void
    {
        $this->last_heartbeat_at = $time;
        $this->silent_since = null;
        $this->status = $this->status === SessionStatus::Silent ? SessionStatus::Active : $this->status;
        $this->assertSaved($this->save());
        $this->raise(new AgentSessionHeartbeatRecorded($this->id));
    }

    /**
     * Starts the session of one start with the driver and model it runs and the request that started it.
     *
     * @throws SessionSelectionFixed
     */
    public function startFor(Agent $agent, self|null $parent, SelectedDriver $selection, string $requestId): void
    {
        $this->agent_id = $agent->id;
        $this->parent_session_id = $parent?->id;
        $this->status = SessionStatus::Active;
        $this->useSelection($selection, $requestId);
    }

    /**
     * The driver ended without an end hook, and the evidence says how the journal knows.
     */
    public function endWithEvidenceAt(CarbonImmutable $time, string $evidence): void
    {
        $this->end_evidence = $evidence;
        $this->endAt($time);
    }

    // ----------[ Predicates ]----------

    public function isActive(): bool
    {
        return $this->status->isRunning();
    }

    // ----------[ Transformers ]----------

    /**
     * This session as a use of the account it ran with; it runs until it ends.
     */
    public function useOf(RecordIdentity $account): AccountUse
    {
        return new AccountUse(
            $account,
            $this->id,
            $this->agent_id,
            $this->selection->driver,
            AccountProcessRole::Execution,
            CarbonImmutable::instance($this->created_at),
            $this->ended_at,
        );
    }

    /**
     * How the session's container has the workspace, from its start's access declaration and whether it helps
     * another session, never from the profile's name: read-only without a grant to change files, the main's own
     * workspace for a session that helps none, and its own clone for a helper that writes.
     */
    public function workspaceUse(AccessPolicy $access): WorkspaceUse
    {
        if (! $access->changesFiles()) {
            return WorkspaceUse::ReadOnly;
        }

        if ($this->parent_session_id === null) {
            return WorkspaceUse::Shared;
        }

        return WorkspaceUse::OwnCheckout;
    }

    // ----------[ Accessors ]----------

    /**
     * The selection this session was started with, rebuilt from its row.
     *
     * @return Attribute<SelectedDriver, never>
     */
    protected function selection(): Attribute
    {
        return Accessor::get(function () {
            $requested = $this->requested_model_type === ModelSelectionType::Named
                ? ModelSelection::named((string) $this->requested_model)
                : ModelSelection::profileDefault();

            return new SelectedDriver(
                (string) $this->driver_key,
                $this->model,
                $requested,
                new SelectionSource($this->driver_source, $this->profile_key, $this->profile_revision),
            );
        });
    }

    /**
     * @return Attribute<StackTarget, never>
     */
    protected function target(): Attribute
    {
        return Accessor::get(fn () => new StackTarget($this->agent_id, $this->id));
    }

    // ----------[ Relations ]----------

    /**
     * @return HasMany<ConversationVisit, $this>
     */
    public function visits(): HasMany
    {
        return $this->hasMany(ConversationVisit::class, 'session_id');
    }

    /**
     * @return BelongsTo<DriverConversation, $this>
     */
    public function currentConversation(): BelongsTo
    {
        return $this->belongsTo(DriverConversation::class, 'current_conversation_id');
    }

    /**
     * @return HasOne<SessionToken, $this>
     */
    public function sessionToken(): HasOne
    {
        return $this->hasOne(SessionToken::class, 'agent_session_id');
    }

    /**
     * @return BelongsTo<Agent, $this>
     */
    public function agent(): BelongsTo
    {
        return $this->belongsTo(Agent::class);
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses a selection for a session whose model is already fixed.
     *
     * @throws SessionSelectionFixed
     */
    private function assertSelectionOpen(): void
    {
        if ($this->getAttribute('model') !== null) {
            throw SessionSelectionFixed::forSession($this->id);
        }
    }

    // ----------[ Queries ]----------

    public static function selectedMessage(string $sessionId): string|null
    {
        return self::query()->whereKey($sessionId)->value('selected_message_id');
    }

    public static function jobSourceMessage(string $sessionId): string|null
    {
        return self::jobSourceMessageIds($sessionId)->value('job_source_message_id');
    }

    /**
     * @return Builder<self>
     */
    public static function jobSourceMessageIds(string $sessionId): Builder
    {
        return self::query()->whereKey($sessionId)->select('job_source_message_id');
    }

    /**
     * Whether the session still runs and acts for this agent: it is one of the agent's own sessions, or a child the
     * agent's session started.
     */
    public static function isRunningFor(string $sessionId, string $agentId): bool
    {
        return self::query()->whereKey($sessionId)->running()->ofAgentOrItsHelpers($agentId)->exists();
    }

    /**
     * The session with this id.
     */
    public static function byId(string $sessionId): self
    {
        return self::query()->whereKey($sessionId)->firstOrFail();
    }

    /**
     * The agent's most recent running session, or null when none runs.
     */
    public static function liveOf(string $agentId): self|null
    {
        return self::query()->runningFor($agentId)->newestFirst()->first();
    }

    /**
     * The driver of each agent's newest running session, keyed by agent id; an agent with none running is left out.
     *
     * @param  list<string>  $ids
     * @return array<string, string>
     */
    public static function runningDriversOf(array $ids): array
    {
        return self::query()
            ->ofAgents($ids)
            ->running()
            ->oldestFirst()
            ->get([
                'agent_id',
                'driver_key',
            ])
            ->pluck('driver_key', 'agent_id')
            ->all();
    }

    /**
     * The agent's most recent session, or null when it never started.
     */
    public static function latestOf(string $agentId): self|null
    {
        return self::query()->ofAgents([$agentId])->newestFirst()->first();
    }

    /**
     * The ids of the agent's own sessions, newest first.
     *
     * @return list<string>
     */
    public static function idsOfAgent(string $agentId, int $limit): array
    {
        $ids = self::query()
            ->ofAgents([$agentId])
            ->newestFirst()
            ->readExactly($limit)
            ->pluck('id');

        return array_values(array_map(strval(...), $ids->all()));
    }

    /**
     * The sessions that may still act, oldest first, for trusted Core maintenance such as a skill refresh.
     *
     * @return list<self>
     */
    public static function runningForMaintenance(int $limit): array
    {
        $running = self::query()
            ->running()
            ->oldestFirst()
            ->readExactly($limit)
            ->get();

        return array_values($running->all());
    }

    /**
     * The running sessions started for an owner's work, oldest first.
     *
     * @return list<self>
     */
    public static function runningStarts(int $limit): array
    {
        $starts = self::query()
            ->running()
            ->started()
            ->oldestFirst()
            ->readExactly($limit)
            ->get();

        return array_values($starts->all());
    }

    /**
     * The running sessions started from one profile revision.
     *
     * @return list<self>
     */
    public static function runningFromRevision(string $key, int $revision, int $limit): array
    {
        $sessions = self::query()
            ->running()
            ->fromProfileRevision($key, $revision)
            ->readExactly($limit)
            ->get();

        return array_values($sessions->all());
    }

    public static function lockedForUpdate(string $sessionId): self
    {
        return self::lockedById($sessionId);
    }

    /**
     * Locks the session's row, with its start token and agent, so a heartbeat waits for an end or a retirement.
     */
    public static function lockedForHeartbeat(string $sessionId): self
    {
        return self::query()->whereKey($sessionId)->with([
            'sessionToken',
            'agent',
        ])->lockForUpdate()->firstOrFail();
    }

    /**
     * Whether the session discovered its tools in or after the second the moment falls in: a discovery is signed to
     * the second, so one in the same second as a generation's start belongs to that generation.
     */
    public static function isDiscoveredInOrAfterSecondOf(string $sessionId, CarbonImmutable $moment): bool
    {
        return self::query()->whereKey($sessionId)->discoveredSince($moment->startOfSecond())->exists();
    }

    /**
     * Whether the session's driver discovered its tools after the moment given.
     */
    public static function isDiscoveredAfter(string $sessionId, CarbonImmutable $moment): bool
    {
        return self::query()->whereKey($sessionId)->discoveredAfter($moment)->exists();
    }

    /**
     * Holds the session's row shared for this transaction, so it cannot end while a change to its stack goes on.
     */
    public static function sharedLockFor(string $sessionId): self
    {
        return self::query()->whereKey($sessionId)->sharedLock()->firstOrFail();
    }

    public static function lockRunningTarget(StackTarget $target): bool
    {
        $running = self::query()->runningFor($target->agentId)->whereKey($target->sessionId)->sharedLock()->first();

        return $running !== null;
    }

    // ----------[ Scopes ]----------

    /**
     * The running sessions of one agent.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function runningFor(Builder $query, string $agentId): void
    {
        $query->where('agent_id', $agentId)->running();
    }

    /**
     * The sessions that may still act.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function running(Builder $query): void
    {
        $query->whereIn('status', array_map(fn (SessionStatus $status) => $status->value, SessionStatus::running()));
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function present(Builder $query, CarbonImmutable $observedAt, PresenceWindow $window): void
    {
        $query->whereIn('status', array_map(fn (SessionStatus $status) => $status->value, SessionStatus::running()))
            ->where('last_heartbeat_at', '>', $observedAt->subSeconds($window->presenceSeconds))
            ->whereHas('sessionToken', fn (Builder $sessionToken) => $sessionToken->whereNull('revoked_at'))
            ->whereHas('agent', fn (Builder $agent) => $agent->whereNull('retired_at'));
    }

    /**
     * The sessions whose runtime is on the host.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function runningOnHost(Builder $query, string $hostId): void
    {
        $query->whereIn('id', AgentRuntime::query()->onHost($hostId)->sessionIds());
    }

    /**
     * The sessions of the agents.
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
     * The agent's sessions and the sessions started under one of them.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofAgentOrItsHelpers(Builder $query, string $agentId): void
    {
        $agentSessions = self::query()->select('id')->ofAgents([$agentId]);

        $query->where(fn (Builder $session) => $session->where('agent_id', $agentId)
            ->orWhereIn('parent_session_id', $agentSessions));
    }

    /**
     * The sessions a start started, whose start record names its owner.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function started(Builder $query): void
    {
        $query->whereIn('id', SessionRequest::query()->withOwner()->sessionIds());
    }

    /**
     * The sessions started from that revision of the profile.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function fromProfileRevision(Builder $query, string $key, int $revision): void
    {
        $query->where('profile_key', $key)->where('profile_revision', $revision);
    }

    /**
     * The sessions discovered at or after that moment.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function discoveredSince(Builder $query, CarbonImmutable $moment): void
    {
        $query->where('discovered_at', '>=', $moment);
    }

    /**
     * The sessions discovered after that moment.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function discoveredAfter(Builder $query, CarbonImmutable $moment): void
    {
        $query->where('discovered_at', '>', $moment);
    }

    /**
     * The sessions started under any of the sessions.
     *
     * @param  Builder<self>  $query
     * @param  array<array-key, string>|Builder<covariant Model>|Closure  $sessionIds
     */
    #[Scope]
    protected function helpersOfAny(Builder $query, array|Builder|Closure $sessionIds): void
    {
        $query->whereIn('parent_session_id', $sessionIds);
    }

    /**
     * The sessions whose runtime has not stopped.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withLiveRuntime(Builder $query): void
    {
        $query->whereIn('id', AgentRuntime::query()->notStopped()->sessionIds());
    }

    /**
     * The rows of any of the given statuses.
     *
     * @param  Builder<self>  $query
     * @param  array<array-key, SessionStatus>|Builder<covariant Model>|Closure  $statuses
     */
    #[Scope]
    protected function withAnyStatus(Builder $query, array|Builder|Closure $statuses): void
    {
        $query->whereIn('status', $statuses);
    }

    /**
     * The rows of the given agent.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofAgent(Builder $query, string $agentId): void
    {
        $query->where('agent_id', $agentId);
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
     * The rows of the given status.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withStatus(Builder $query, SessionStatus $status): void
    {
        $query->where('status', $status);
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

    /**
     * The rows with their agent and currentConversation loaded.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withAgentAndCurrentConversation(Builder $query): void
    {
        $query->with(['agent', 'currentConversation']);
    }

    /**
     * The rows with their sessionToken and agent loaded.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withSessionTokenAndAgent(Builder $query): void
    {
        $query->with(['sessionToken', 'agent']);
    }

    /**
     * The rows with their sessionToken loaded.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withSessionToken(Builder $query): void
    {
        $query->with('sessionToken');
    }

    /**
     * The rows with their agent loaded.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withAgent(Builder $query): void
    {
        $query->with('agent');
    }

    /**
     * The sessions that never sent a heartbeat.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function neverBeat(Builder $query): void
    {
        $query->whereNull('last_heartbeat_at');
    }

    /**
     * The sessions whose last heartbeat came after the moment.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function beatAfter(Builder $query, CarbonImmutable $moment): void
    {
        $query->where('last_heartbeat_at', '>', $moment);
    }

    /**
     * The sessions silent since the cutoff or before it.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function silentSince(Builder $query, CarbonImmutable $cutoff): void
    {
        $query->where('silent_since', '<=', $cutoff);
    }

    /**
     * The sessions whose last heartbeat is no later than the cutoff, or that never beat and were made by then.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function showedNoLifeSince(Builder $query, CarbonImmutable $cutoff): void
    {
        $query->where(fn (Builder $silent) => $silent->where('last_heartbeat_at', '<=', $cutoff)
            ->orWhere(fn (Builder $neverBeat) => $neverBeat
                ->whereNull('last_heartbeat_at')
                ->where('created_at', '<=', $cutoff)));
    }

    /**
     * Only the agent of each row, as a subquery.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function agentIds(Builder $query): void
    {
        $query->select('agent_id');
    }

    /**
     * The sessions that keep no job source message yet.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withoutJobSource(Builder $query): void
    {
        $query->whereNull('job_source_message_id');
    }

    /**
     * The session whose start token hashes to the given hash.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withSessionTokenHash(Builder $query, string $hash): void
    {
        $query->whereHas('sessionToken', fn (Builder $sessionToken) => $sessionToken->where('token_hash', $hash));
    }

    /**
     * The sessions whose tools were never discovered, or last discovered before the moment.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function undiscoveredSince(Builder $query, CarbonImmutable $moment): void
    {
        $query->where(fn (Builder $older) => $older->whereNull('discovered_at')->orWhere('discovered_at', '<', $moment));
    }
}
