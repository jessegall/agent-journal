<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Actors\Support\PresenceWindow;
use App\Agents\Enums\ModelSelectionType;
use App\Agents\Enums\ProgramSourceType;
use App\Agents\Enums\SessionStatus;
use App\Agents\Exceptions\CredentialRejected;
use App\Agents\Exceptions\SessionSelectionFixed;
use App\Agents\Support\ModelSelection;
use App\Agents\Support\SelectedProgram;
use App\Agents\Support\SelectionSource;
use App\Links\Support\Linkable;
use App\Programs\Enums\HookProgram;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * One launch of an agent: one journal session, its parent session for a child, and the program's own session once verified.
 *
 * @property string $id
 * @property string $agent_id
 * @property string|null $parent_session_id
 * @property string|null $program
 * @property string|null $current_conversation_id
 * @property string $model
 * @property ModelSelectionType $requested_model_type
 * @property string|null $requested_model
 * @property ProgramSourceType $program_source
 * @property string|null $profile_key
 * @property int|null $profile_revision
 * @property string $launch_request_id
 * @property SessionStatus $status
 * @property CarbonImmutable|null $ended_at
 * @property CarbonImmutable|null $last_heartbeat_at
 * @property CarbonImmutable|null $silent_since
 * @property string|null $end_evidence
 * @property CarbonImmutable|null $discovered_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Agent $agent
 * @property-read LaunchCredential|null $credential
 */
#[Fillable(['program', 'current_conversation_id', 'discovered_at', 'model', 'requested_model_type', 'requested_model', 'program_source', 'profile_key', 'profile_revision', 'launch_request_id'])]
final class AgentSession extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids, Linkable;

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
            'program_source' => ProgramSourceType::class,
            'profile_revision' => 'integer',
        ];
    }

    /**
     * Starts the session of one launch with the program and model it runs and the request that launched it.
     *
     * @throws SessionSelectionFixed
     */
    public function startFor(Agent $agent, self|null $parent, SelectedProgram $selection, string $requestId): void
    {
        $this->agent_id = $agent->id;
        $this->parent_session_id = $parent?->id;
        $this->status = SessionStatus::Active;
        $this->useSelection($selection, $requestId);
    }

    /**
     * Records the selection and the launch request once; a session never changes the program or model it ran.
     *
     * @throws SessionSelectionFixed
     */
    public function useSelection(SelectedProgram $selection, string $requestId): void
    {
        if ($this->getAttribute('model') !== null) {
            throw SessionSelectionFixed::forSession($this->id);
        }

        $this->program = $selection->program->value;
        $this->model = $selection->model;
        $this->requested_model_type = $selection->requested->type;
        $this->requested_model = $selection->requested->model;
        $this->program_source = $selection->source->programSource;
        $this->profile_key = $selection->source->profileKey;
        $this->profile_revision = $selection->source->profileRevision;
        $this->launch_request_id = $requestId;
        $this->save();
    }

    /**
     * The selection this session was launched with, rebuilt from its row.
     */
    public function selection(): SelectedProgram
    {
        $requested = $this->requested_model_type === ModelSelectionType::Named ? ModelSelection::named((string) $this->requested_model) : ModelSelection::profileDefault();

        return new SelectedProgram(HookProgram::from((string) $this->program), $this->model, $requested, new SelectionSource($this->program_source, $this->profile_key, $this->profile_revision));
    }

    public function enterConversation(ProgramConversation $conversation): void
    {
        $this->current_conversation_id = $conversation->id;
        $this->save();
    }

    /**
     * The session with this id.
     */
    public static function byId(string $sessionId): self
    {
        return self::query()->whereKey($sessionId)->firstOrFail();
    }

    /**
     * The agent's most recent session, or null when it never launched.
     */
    public static function latestOf(string $agentId): self|null
    {
        return self::query()->where('agent_id', $agentId)->orderByDesc('created_at')->orderByDesc('id')->first();
    }

    /**
     * The sessions that may still act, oldest first, for trusted Core maintenance such as a skill refresh.
     *
     * @return list<self>
     */
    public static function runningForMaintenance(int $limit): array
    {
        return array_values(self::query()->whereIn('status', array_map(fn (SessionStatus $status) => $status->value, SessionStatus::running()))->orderBy('created_at')->readLimit($limit)->get()->all());
    }

    public static function lockedForUpdate(string $sessionId): self
    {
        return self::query()->whereKey($sessionId)->lockForUpdate()->firstOrFail();
    }

    /**
     * @return HasMany<ConversationVisit, $this>
     */
    public function visits(): HasMany
    {
        return $this->hasMany(ConversationVisit::class, 'session_id');
    }

    /**
     * @return BelongsTo<ProgramConversation, $this>
     */
    public function currentConversation(): BelongsTo
    {
        return $this->belongsTo(ProgramConversation::class, 'current_conversation_id');
    }

    public function endAt(CarbonImmutable $time): void
    {
        $this->status = SessionStatus::Ended;
        $this->ended_at = $time;
        $this->save();
    }

    /**
     * The program ended without an end hook, and the evidence says how the journal knows.
     */
    public function endWithEvidenceAt(CarbonImmutable $time, string $evidence): void
    {
        $this->end_evidence = $evidence;
        $this->endAt($time);
    }

    /**
     * Marks every running session that has shown no life since the cutoff as silent, in one update.
     */
    public static function markSilentIfNoHeartbeatSince(CarbonImmutable $cutoff, CarbonImmutable $now): void
    {
        self::query()->where('status', SessionStatus::Active->value)
            ->where(fn (Builder $silent) => $silent->where('last_heartbeat_at', '<=', $cutoff)
                ->orWhere(fn (Builder $neverBeat) => $neverBeat->whereNull('last_heartbeat_at')->where('created_at', '<=', $cutoff)))
            ->update(['status' => SessionStatus::Silent->value, 'silent_since' => $now]);
    }

    /**
     * Locks the session's row, with its credential and agent, so a heartbeat waits for an end or a retirement.
     */
    public static function lockedForHeartbeat(string $sessionId): self
    {
        return self::query()->whereKey($sessionId)->with(['credential', 'agent'])->lockForUpdate()->firstOrFail();
    }

    /**
     * Records the launched program's tool discovery at its signed issue time; an older discovery never moves it back.
     */
    public static function recordDiscoveryAt(string $sessionId, CarbonImmutable $signedAt): void
    {
        self::query()->whereKey($sessionId)
            ->where(fn (Builder $older) => $older->whereNull('discovered_at')->orWhere('discovered_at', '<', $signedAt))
            ->update(['discovered_at' => $signedAt]);
    }

    /**
     * Whether the session's program discovered its tools after the moment given.
     */
    public static function discoveredAfter(string $sessionId, CarbonImmutable $moment): bool
    {
        return self::query()->whereKey($sessionId)->where('discovered_at', '>', $moment)->exists();
    }

    /**
     * Holds the session's row shared for this transaction, so it cannot end while a change to its stack goes on.
     */
    public static function sharedLockFor(string $sessionId): self
    {
        return self::query()->whereKey($sessionId)->sharedLock()->firstOrFail();
    }

    /**
     * Whether a message may still be addressed to this session: it is running or waiting, not ended.
     * Delivery and wake ask the same question.
     */
    public function canReceiveMessages(): bool
    {
        return $this->status->isRunning();
    }

    public function isActive(): bool
    {
        return $this->status->isRunning();
    }

    /**
     * Refuses a session that may no longer act: no credential, a revoked one, an ended session or a retired agent.
     *
     * @throws CredentialRejected
     */
    public function requireUsable(): void
    {
        if ($this->credential === null) {
            throw CredentialRejected::unknown();
        }

        if ($this->credential->isRevoked()) {
            throw CredentialRejected::revoked();
        }

        if (! $this->isActive()) {
            throw CredentialRejected::sessionEnded();
        }

        if ($this->agent->isRetired()) {
            throw CredentialRejected::agentRetired();
        }
    }

    /**
     * A sign of life from the host: a silent session is active again.
     */
    public function recordHeartbeatAt(CarbonImmutable $time): void
    {
        $this->last_heartbeat_at = $time;
        $this->silent_since = null;
        $this->status = $this->status === SessionStatus::Silent ? SessionStatus::Active : $this->status;
        $this->save();
    }

    /**
     * The running sessions of one agent.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function runningFor(Builder $query, string $agentId): void
    {
        $query->where('agent_id', $agentId)->whereIn('status', array_map(fn (SessionStatus $status) => $status->value, SessionStatus::running()));
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function present(Builder $query, CarbonImmutable $observedAt, PresenceWindow $window): void
    {
        $query->whereIn('status', array_map(fn (SessionStatus $status) => $status->value, SessionStatus::running()))
            ->where('last_heartbeat_at', '>', $observedAt->subSeconds($window->presenceSeconds))
            ->whereHas('credential', fn (Builder $credential) => $credential->whereNull('revoked_at'))
            ->whereHas('agent', fn (Builder $agent) => $agent->whereNull('retired_at'));
    }

    /**
     * @return HasOne<LaunchCredential, $this>
     */
    public function credential(): HasOne
    {
        return $this->hasOne(LaunchCredential::class, 'agent_session_id');
    }

    /**
     * @return BelongsTo<Agent, $this>
     */
    public function agent(): BelongsTo
    {
        return $this->belongsTo(Agent::class);
    }
}
