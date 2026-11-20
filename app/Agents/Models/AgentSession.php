<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Actors\Support\PresenceWindow;
use App\Agents\Enums\AccountProcessRole;
use App\Agents\Enums\ModelSelectionType;
use App\Agents\Enums\ProgramSourceType;
use App\Agents\Enums\SessionStatus;
use App\Agents\Exceptions\SessionSelectionFixed;
use App\Agents\Support\AccountUse;
use App\Agents\Support\ModelSelection;
use App\Agents\Support\SelectedProgram;
use App\Agents\Support\SelectionSource;
use App\Agents\Support\StackTarget;
use App\Links\Support\Linkable;
use App\Programs\Enums\HookProgram;
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
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * One start of an agent: one journal session, its parent session for a child, and the program's own session once
 * verified.
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
 * @property string $profile_key
 * @property int $profile_revision
 * @property string $start_request_id
 * @property string|null $skill_generation_id
 * @property SessionStatus $status
 * @property CarbonImmutable|null $ended_at
 * @property CarbonImmutable|null $last_heartbeat_at
 * @property CarbonImmutable|null $silent_since
 * @property string|null $end_evidence
 * @property CarbonImmutable|null $discovered_at
 * @property Carbon $created_at
 * @property Carbon|null $updated_at
 * @property-read Agent $agent
 * @property-read StartToken|null $startToken
 */
#[Fillable([
    'program',
    'current_conversation_id',
    'discovered_at',
    'model',
    'requested_model_type',
    'requested_model',
    'program_source',
    'profile_key',
    'profile_revision',
    'start_request_id',
    'skill_generation_id',
])]
final class AgentSession extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids, Linkable;

    // ----------[ Constructors ]----------

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

    // ----------[ Queries ]----------

    public static function selectMessage(string $sessionId, string $messageId): void
    {
        self::query()->whereKey($sessionId)->update(['selected_message_id' => $messageId]);
    }

    public static function selectedMessage(string $sessionId): string|null
    {
        return self::query()->whereKey($sessionId)->value('selected_message_id');
    }

    public static function captureJobSourceMessage(string $sessionId, string $messageId): void
    {
        self::query()->whereKey($sessionId)->whereNull('job_source_message_id')->update([
            'job_source_message_id' => $messageId,
        ]);
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
        return self::query()->runningFor($agentId)->orderByDesc('created_at')->orderByDesc('id')->first();
    }

    /**
     * The agent's most recent session, or null when it never started.
     */
    public static function latestOf(string $agentId): self|null
    {
        return self::query()->where('agent_id', $agentId)->orderByDesc('created_at')->orderByDesc('id')->first();
    }

    /**
     * The ids of the agent's own sessions, newest first.
     *
     * @return list<string>
     */
    public static function idsOfAgent(string $agentId, int $limit): array
    {
        $ids = self::query()
            ->where('agent_id', $agentId)
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->readLimit($limit)
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
            ->orderBy('created_at')
            ->readLimit($limit)
            ->get();

        return array_values($running->all());
    }

    /**
     * The running sessions launched for an owner's work, oldest first.
     *
     * @return list<self>
     */
    public static function runningLaunches(int $limit): array
    {
        $launches = self::query()
            ->running()
            ->whereIn('id', StartRecord::query()->whereNotNull('owner_reference')->select('session_id'))
            ->orderBy('created_at')
            ->readLimit($limit)
            ->get();

        return array_values($launches->all());
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
            ->where('profile_key', $key)
            ->where('profile_revision', $revision)
            ->readLimit($limit)
            ->get();

        return array_values($sessions->all());
    }

    public static function lockedForUpdate(string $sessionId): self
    {
        return self::query()->whereKey($sessionId)->lockForUpdate()->firstOrFail();
    }

    /**
     * Marks every running session that has shown no life since the cutoff as silent, in one update.
     */
    public static function markSilentIfNoHeartbeatSince(CarbonImmutable $cutoff, CarbonImmutable $now): void
    {
        self::query()->where('status', SessionStatus::Active->value)
            ->where(fn (Builder $silent) => $silent->where('last_heartbeat_at', '<=', $cutoff)
                ->orWhere(fn (Builder $neverBeat) => $neverBeat
                    ->whereNull('last_heartbeat_at')
                    ->where('created_at', '<=', $cutoff)))
            ->update(['status' => SessionStatus::Silent->value, 'silent_since' => $now]);
    }

    /**
     * Locks the session's row, with its start token and agent, so a heartbeat waits for an end or a retirement.
     */
    public static function lockedForHeartbeat(string $sessionId): self
    {
        return self::query()->whereKey($sessionId)->with(['startToken', 'agent'])->lockForUpdate()->firstOrFail();
    }

    /**
     * Records the started program's tool discovery at its signed issue time; an older discovery never moves it back.
     */
    public static function recordDiscoveryAt(string $sessionId, CarbonImmutable $signedAt): void
    {
        self::query()->whereKey($sessionId)
            ->where(fn (Builder $older) => $older->whereNull('discovered_at')->orWhere('discovered_at', '<', $signedAt))
            ->update(['discovered_at' => $signedAt]);
    }

    /**
     * Whether the session discovered its tools in or after the second the moment falls in: a discovery is signed to
     * the second, so one in the same second as a generation's start belongs to that generation.
     */
    public static function discoveredInOrAfterSecondOf(string $sessionId, CarbonImmutable $moment): bool
    {
        return self::query()->whereKey($sessionId)->where('discovered_at', '>=', $moment->startOfSecond())->exists();
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

    public static function lockRunningTarget(StackTarget $target): bool
    {
        $running = self::query()->runningFor($target->agentId)->whereKey($target->sessionId)->sharedLock()->first();

        return $running !== null;
    }

    // ----------[ Mutations ]----------

    /**
     * Records the selection and the start request once; a session never changes the program or model it ran.
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
        $this->start_request_id = $requestId;
        $this->save();
    }

    /**
     * Records the skill generation the session's program was spawned with.
     */
    public function recordSkillGeneration(string $generationId): void
    {
        $this->skill_generation_id = $generationId;
        $this->save();
    }

    public function enterConversation(ProgramConversation $conversation): void
    {
        $this->current_conversation_id = $conversation->id;
        $this->save();
    }

    public function endAt(CarbonImmutable $time): void
    {
        $this->status = SessionStatus::Ended;
        $this->ended_at = $time;
        $this->save();
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

    // ----------[ Answers ]----------

    /**
     * Starts the session of one start with the program and model it runs and the request that started it.
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
     * The selection this session was started with, rebuilt from its row.
     */
    public function selection(): SelectedProgram
    {
        $requested = $this->requested_model_type === ModelSelectionType::Named
            ? ModelSelection::named((string) $this->requested_model)
            : ModelSelection::profileDefault();

        return new SelectedProgram(
            HookProgram::from((string) $this->program),
            $this->model,
            $requested,
            new SelectionSource($this->program_source, $this->profile_key, $this->profile_revision),
        );
    }

    public function target(): StackTarget
    {
        return new StackTarget($this->agent_id, $this->id);
    }

    /**
     * This session as a use of the account it ran with; it runs until it ends.
     */
    public function useOf(RecordIdentity $account): AccountUse
    {
        return new AccountUse(
            $account,
            $this->id,
            $this->agent_id,
            $this->selection()->program->value,
            AccountProcessRole::Execution,
            CarbonImmutable::instance($this->created_at),
            $this->ended_at,
        );
    }

    /**
     * The program ended without an end hook, and the evidence says how the journal knows.
     */
    public function endWithEvidenceAt(CarbonImmutable $time, string $evidence): void
    {
        $this->end_evidence = $evidence;
        $this->endAt($time);
    }

    public function isActive(): bool
    {
        return $this->status->isRunning();
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
     * @return BelongsTo<ProgramConversation, $this>
     */
    public function currentConversation(): BelongsTo
    {
        return $this->belongsTo(ProgramConversation::class, 'current_conversation_id');
    }

    /**
     * @return HasOne<StartToken, $this>
     */
    public function startToken(): HasOne
    {
        return $this->hasOne(StartToken::class, 'agent_session_id');
    }

    /**
     * @return BelongsTo<Agent, $this>
     */
    public function agent(): BelongsTo
    {
        return $this->belongsTo(Agent::class);
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
            ->whereHas('startToken', fn (Builder $startToken) => $startToken->whereNull('revoked_at'))
            ->whereHas('agent', fn (Builder $agent) => $agent->whereNull('retired_at'));
    }
}
