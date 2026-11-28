<?php

declare(strict_types=1);

namespace App\Models\Agents;

use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Drivers\Enums\ExecutablePlace;
use App\Agents\Drivers\Enums\HoldReason;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Agents\Values\RuntimeIntent;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Events\Sessions\AgentRuntimeClosed;
use App\Events\Sessions\AgentRuntimeConfirmedAlive;
use App\Events\Sessions\AgentRuntimeConversationChosen;
use App\Events\Sessions\AgentRuntimeEffortApplied;
use App\Events\Sessions\AgentRuntimeHeld;
use App\Events\Sessions\AgentRuntimeHostChanged;
use App\Events\Sessions\AgentRuntimeModelApplied;
use App\Events\Sessions\AgentRuntimeObserved;
use App\Events\Sessions\AgentRuntimeProcessGenerationAdvanced;
use App\Events\Sessions\AgentRuntimeSettingsObserved;
use App\Events\Sessions\AgentRuntimeStarted;
use App\Events\Sessions\AgentRuntimeStartGrantClaimed;
use App\Events\Sessions\AgentRuntimeStartGrantHeld;
use App\Events\Sessions\AgentRuntimeStartProven;
use App\Events\Sessions\AgentRuntimeStopRequested;
use App\Hosts\Enums\HostProcessPurpose;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\TerminalView;
use App\Models\Hosts\HostProcess;
use App\Models\Projects\Host;
use App\Models\Sessions\SessionRequest;
use App\Models\Support\JournalModel;
use App\Processes\Data\RuntimeStatus;
use App\Processes\Enums\RuntimeActivity;
use App\Records\Contracts\ReadableModel;
use App\Support\RuntimeStatuses;
use App\Values\PinnedDriver;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use PhpOption\Option;

/**
 * @property string $id
 * @property string $agent_session_id
 * @property string $host_id
 * @property DriverType $driver_type
 * @property bool $remember
 * @property string $driver_key
 * @property string $family
 * @property string|null $conversation_id
 * @property CarbonImmutable|null $conversation_named_at
 * @property CarbonImmutable|null $start_proven_at
 * @property string $driver_label
 * @property bool $has_screen
 * @property string $driver_build
 * @property string $profile
 * @property string $canonical_folder
 * @property RuntimeActivity $activity
 * @property HoldReason $hold_reason
 * @property string|null $requested_model
 * @property string|null $staged_model
 * @property string|null $observed_model
 * @property string|null $requested_effort
 * @property string|null $staged_effort
 * @property string|null $observed_effort
 * @property CarbonImmutable|null $settings_observed_at
 * @property string|null $start_grant
 * @property int $process_generation
 * @property CarbonImmutable|null $generation_started_at
 * @property CarbonImmutable|null $last_observed_at
 * @property int $observation_sequence
 * @property int $row_version
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Host|null $host
 * @property-read Collection<int, DriverRequest> $requests
 * @property-read int|null $requests_count
 * @property-read AgentSession|null $session
 * @property-read Collection<int, TerminalView> $terminalViews
 * @property-read int|null $terminal_views_count
 *
 * @mixin \Eloquent
 */
final class AgentRuntime extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use Linkable;
    use RaisesEvents;

    /**
     * How old a host observation may be before the runtime's status is shown as stale.
     */
    public const int FRESH_SECONDS = 60;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'driver_type' => DriverType::class,
            'has_screen' => 'boolean',
            'start_grant' => 'encrypted',
            'activity' => RuntimeActivity::class,
            'hold_reason' => HoldReason::class,
            'settings_observed_at' => 'immutable_datetime',
            'last_observed_at' => 'immutable_datetime',
            'start_proven_at' => 'immutable_datetime',
            'conversation_named_at' => 'immutable_datetime',
            'generation_started_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    public static function create(AgentSession $session, RuntimeIntent $intent, PinnedDriver $pin): self
    {
        $registration = $pin->registration;
        $runtime = new self();
        $runtime->agent_session_id = $session->id;
        $runtime->host_id = $intent->hostId;
        $runtime->driver_type = $intent->driverType;
        $runtime->remember = $intent->savesDriverType;
        $runtime->driver_key = (string) $registration->key;
        $runtime->family = $registration->family;
        $runtime->driver_label = $registration->label;
        $runtime->has_screen = $pin->hasScreen();
        $runtime->driver_build = $intent->driverBuild;
        $runtime->profile = $intent->profile;
        $runtime->canonical_folder = $intent->folder;
        $runtime->requested_model = $intent->model;
        $runtime->requested_effort = $intent->effort;

        return $runtime;
    }

    // ----------[ Mutations ]----------

    /**
     * A stop was asked for: the runtime takes no more requests while it stops.
     */
    public function markStopping(): void
    {
        $this->activity = RuntimeActivity::Stopping;
        $this->saveAndAssert();
        $this->raise(new AgentRuntimeStopRequested($this->id, $this->agent_session_id));
    }

    /**
     * Holds the runtime's normal work for the reason given.
     */
    public function holdFor(HoldReason $reason): void
    {
        $this->hold_reason = $reason;
        $this->saveAndAssert();
        $this->raise(new AgentRuntimeHeld($this->id, $reason));
    }

    /**
     * The process ended for good: the runtime is stopped and every request still open gets its final outcome, a
     * stop as applied and anything else as unavailable.
     */
    public function closeAfterExit(): void
    {
        $this->activity = RuntimeActivity::Stopped;
        $this->saveAndAssert();
        $this->raise(new AgentRuntimeClosed($this->id));
    }

    /**
     * Starts the runtime's first process: activity Starting, nothing held, generation one.
     */
    public function begin(): void
    {
        $this->activity = RuntimeActivity::Starting;
        $this->hold_reason = HoldReason::None;
        $this->process_generation = 1;
        $this->generation_started_at = CarbonImmutable::now();
        $this->saveAndAssert();
        $this->raise(new AgentRuntimeStarted($this->id));
    }

    /**
     * The host proved the runtime's process still lives: what it last reported still holds, so the report is fresh
     * again. An idle runtime reports nothing else between two turns.
     */
    public function confirmAlive(CarbonImmutable $at): void
    {
        $this->last_observed_at = $at;
        $this->row_version++;
        $this->saveAndAssert();
        $this->raise(new AgentRuntimeConfirmedAlive($this->id));
    }

    /**
     * Records what the host saw, unless the report comes from an older process generation than the one recorded.
     */
    public function recordObservation(
        RuntimeActivity $activity,
        HoldReason $hold,
        int $processGeneration,
        CarbonImmutable $at,
    ): bool {
        if ($processGeneration < $this->process_generation) {
            return false;
        }

        if ($processGeneration > $this->process_generation) {
            $this->generation_started_at = $at;
        }

        $this->activity = $activity;
        $this->hold_reason = $hold;
        $this->process_generation = $processGeneration;
        $this->last_observed_at = $at;
        $this->observation_sequence++;
        $this->row_version++;
        $this->saveAndAssert();
        $this->raise(new AgentRuntimeObserved($this->id, $activity, $processGeneration));

        return true;
    }

    /**
     * Records the model and effort the driver reports it runs with now.
     */
    public function observeSettings(string|null $model, string|null $effort, CarbonImmutable $at): void
    {
        $this->observed_model = $model ?? $this->observed_model;
        $this->observed_effort = $effort ?? $this->observed_effort;
        $this->settings_observed_at = $at;
        $this->saveAndAssert();
        $this->raise(new AgentRuntimeSettingsObserved($this->id));
    }

    /**
     * Keeps the start token for the host's one start grant; it is encrypted at rest and cleared when claimed.
     */
    public function holdStartGrant(string $token): void
    {
        $this->start_grant = $token;
        $this->saveAndAssert();
        $this->raise(new AgentRuntimeStartGrantHeld($this->id));
    }

    /**
     * The conversation every turn of a runtime the journal opens itself continues, chosen when it opens, or when its
     * driver names the conversation it started.
     */
    public function chooseConversation(string $conversationId): void
    {
        $this->conversation_id = $conversationId;
        $this->saveAndAssert();
        $this->raise(new AgentRuntimeConversationChosen($this->id));
    }

    /**
     * The runtime's driver named the conversation it started, such as a Codex thread, so later turns resume it.
     */
    public function nameConversation(string $conversationId, CarbonImmutable $at): void
    {
        $this->conversation_named_at = $at;
        $this->chooseConversation($conversationId);
    }

    /**
     * Records that the probe printed the pinned build, so the runtime's turns may open.
     */
    public function proveStart(CarbonImmutable $now): void
    {
        $this->start_proven_at = $now;
        $this->saveAndAssert();
        $this->raise(new AgentRuntimeStartProven($this->id));
    }

    /**
     * Whether the runtime's start was proven: its driver is known to run.
     */
    public function hasProvenStart(): bool
    {
        return $this->start_proven_at !== null;
    }

    /**
     * Whether a process of the purpose runs for the runtime now, such as its turn or its terminal.
     */
    public function hasLiveProcess(HostProcessPurpose $purpose): bool
    {
        return $this->hostProcesses()->live()->ofPurposes([$purpose])->exists();
    }

    /**
     * The ids of the runtime's live terminal or turn: the agent driver itself, which waits while its stop is checked.
     *
     * @return list<string>
     */
    public function liveAgentProcessIds(): array
    {
        $agentProcesses = [
            HostProcessPurpose::AgentTerminal,
            HostProcessPurpose::AgentTurn,
        ];

        return array_values(array_map(
            strval(...),
            $this->hostProcesses()->live()->ofPurposes($agentProcesses)->limit(8)->pluck('id')->all(),
        ));
    }

    /**
     * Whether the runtime's conversation is one its driver already holds, so its next process resumes it: a process of
     * the purpose that resumes it ran in it, its driver named it, or its start chose it to continue.
     */
    public function continuesConversation(HostProcessPurpose $resumedBy): bool
    {
        return $this->conversation_named_at !== null
            || $this->hostProcesses()->ofPurposes([$resumedBy])->exists()
            || SessionRequest::resolveConversationTargetOf($this->agent_session_id) === $this->conversation_id;
    }

    /**
     * Hands the start token over once: the first claim gets it and clears it, any later claim gets nothing.
     */
    public function claimStartGrant(): string|null
    {
        $token = $this->start_grant;
        $this->start_grant = null;
        $this->saveAndAssert();
        $this->raise(new AgentRuntimeStartGrantClaimed($this->id));

        return $token;
    }

    /**
     * The model a start of the runtime runs at: the one a change asked for, else the one its session was started at.
     */
    public function startModel(): string
    {
        return $this->requested_model ?? AgentSession::query()->findOrFail($this->agent_session_id)->model;
    }

    /**
     * The effort a start of the runtime runs at: the one a change asked for, else the one its session was started at.
     */
    public function startEffort(): string
    {
        return $this->requested_effort ?? AgentSession::query()->findOrFail($this->agent_session_id)->effort;
    }

    /**
     * The driver applied a model change: every later start of the runtime runs at the model.
     */
    public function recordAppliedModel(string $model): void
    {
        $this->requested_model = $model;
        $this->saveAndAssert();
        $this->raise(new AgentRuntimeModelApplied($this->id));
    }

    /**
     * The driver applied an effort change: every later start of the runtime runs at the effort.
     */
    public function recordAppliedEffort(string $effort): void
    {
        $this->requested_effort = $effort;
        $this->saveAndAssert();
        $this->raise(new AgentRuntimeEffortApplied($this->id));
    }

    /**
     * The host healed the runtime's crashed process: its next process generation starts now, so reports of the
     * crashed one are refused.
     */
    public function beginProcessGeneration(CarbonImmutable $at): void
    {
        $this->process_generation++;
        $this->generation_started_at = $at;
        $this->row_version++;
        $this->saveAndAssert();
        $this->raise(new AgentRuntimeProcessGenerationAdvanced($this->id, $this->process_generation));
    }

    /**
     * Moves the runtime to a new process generation on the given host, starting again with nothing held and the
     * rotated credential waiting for that host's start grant; reports of the old generation are refused after it.
     */
    public function reassignTo(string $hostId, string $sessionToken): void
    {
        $this->host_id = $hostId;
        $this->process_generation++;
        $this->activity = RuntimeActivity::Starting;
        $this->hold_reason = HoldReason::None;
        $this->start_grant = $sessionToken;
        $this->saveAndAssert();
        $this->raise(new AgentRuntimeHostChanged($this->id, $hostId, $this->process_generation));
    }

    /**
     * Whether the runtime's driver draws a screen a viewer can watch, by its pinned capabilities.
     */
    public function hasScreen(): bool
    {
        return $this->has_screen;
    }

    /**
     * Whether the runtime is stopping or stopped.
     */
    public function hasEnded(): bool
    {
        return in_array($this->activity, [RuntimeActivity::Stopping, RuntimeActivity::Stopped], true);
    }

    /**
     * Seconds since the host last reported on this runtime, or null when it never did.
     */
    public function observationAge(CarbonImmutable $now): int|null
    {
        return self::secondsSince($this->last_observed_at, $now);
    }

    /**
     * The runtime as stored, read at the given time: its settings in their three states and how old its facts are.
     */
    public function status(CarbonImmutable $now): RuntimeStatus
    {
        return RuntimeStatuses::ofRuntime($this, $now);
    }

    /**
     * How old the runtime's last seen settings are at this time, in whole seconds; none before they were first seen.
     */
    public function settingsAge(CarbonImmutable $now): int|null
    {
        return self::secondsSince($this->settings_observed_at, $now);
    }

    /**
     * Whether the last observation is older than the freshness bound, or missing: the status may no longer hold.
     */
    public function isStale(CarbonImmutable $now): bool
    {
        $age = $this->observationAge($now);

        // An idle agent has nothing new to report, so its idle report holds until its process reports a change.
        return $age === null || ($this->activity !== RuntimeActivity::Idle && $age > self::FRESH_SECONDS);
    }

    /**
     * Whether a user may release the runtime's hold: an interrupt or a call for attention. A hold the driver
     * itself shows, such as compacting or a login, ends only on the driver's own evidence.
     */
    public function canReleaseHold(): bool
    {
        return $this->isHeldFromWork();
    }

    /**
     * Whether the journal holds the runtime from new work: interrupted, or needing attention, until a user releases it.
     */
    public function isHeldFromWork(): bool
    {
        return in_array($this->hold_reason, [HoldReason::Interrupted, HoldReason::NeedsAttention], true);
    }

    /**
     * Whether the runtime is held for the reason given.
     */
    public function isHeldFor(HoldReason $reason): bool
    {
        return $this->hold_reason === $reason;
    }

    /**
     * The runtime is held for nothing any more, so its work goes on.
     */
    public function releaseHold(): void
    {
        $this->holdFor(HoldReason::None);
    }

    /**
     * Whether an operator may move the runtime to a new process: its host lost it or could not prove what runs.
     */
    public function canBeReassigned(): bool
    {
        return $this->hold_reason === HoldReason::NeedsAttention
            || $this->activity === RuntimeActivity::HostUnavailable;
    }

    /**
     * Whether the runtime runs on the host given.
     */
    public function isAssignedTo(string $hostId): bool
    {
        return $this->host_id === $hostId;
    }

    /**
     * Whether the host reported this runtime running after the boundary: an observation counted later than it, of a
     * process that is not stopping or stopped. A delayed report counted before the boundary proves nothing.
     */
    public function isObservedRunningAfter(int $boundary): bool
    {
        return $this->observation_sequence > $boundary
            && ! in_array($this->activity, [RuntimeActivity::Stopping, RuntimeActivity::Stopped], true);
    }

    /**
     * Whether the runtime is at the process generation given, so a report about it still counts.
     */
    public function isAtGeneration(int $processGeneration): bool
    {
        return $this->process_generation === $processGeneration;
    }

    /**
     * Whether the runtime's host runs its agents in containers.
     */
    public function runsContained(): bool
    {
        return $this->loadMissing('host')->host->arrangement->isContained();
    }

    // ----------[ Calculations ]----------

    /**
     * How many live terminal views watch the runtime, counted once with the runtime when it was read with its watchers.
     */
    public function countWatchers(): int
    {
        if (! array_key_exists('watchers', $this->getAttributes())) {
            $this->loadCount(['terminalViews as watchers' => self::liveViews(...)]);
        }

        return (int) $this->getAttribute('watchers');
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<AgentSession, $this>
     */
    public function session(): BelongsTo
    {
        return $this->belongsTo(AgentSession::class, 'agent_session_id');
    }

    /**
     * Where this runtime's host runs a driver's executable from.
     */
    public function executablePlace(): ExecutablePlace
    {
        return $this->loadMissing('host')->host->executablePlace();
    }

    /**
     * @return BelongsTo<Host, $this>
     */
    public function host(): BelongsTo
    {
        return $this->belongsTo(Host::class);
    }

    /**
     * @return HasMany<HostProcess, $this>
     */
    public function hostProcesses(): HasMany
    {
        return $this->hasMany(HostProcess::class);
    }

    /**
     * @return HasMany<DriverRequest, $this>
     */
    public function requests(): HasMany
    {
        return $this->hasMany(DriverRequest::class);
    }

    /**
     * @return HasMany<TerminalView, $this>
     */
    public function terminalViews(): HasMany
    {
        return $this->hasMany(TerminalView::class);
    }

    // ----------[ Internals ]----------

    /**
     * Whole seconds from a moment to now, or null for a moment that never came.
     */
    private static function secondsSince(CarbonImmutable|null $moment, CarbonImmutable $now): int|null
    {
        if ($moment === null) {
            return null;
        }

        return (int) $moment->diffInSeconds($now, true);
    }

    /**
     * The live terminal views of any viewer, which is what a runtime's watcher count counts.
     *
     * @param  Builder<TerminalView>  $views
     */
    private static function liveViews(Builder $views): void
    {
        $views->acrossActors()->live();
    }

    // ----------[ Queries ]----------

    /**
     * The runtime a session opens on a host, as its intent describes it, not saved yet.
     */
    public static function hasSession(string $sessionId): bool
    {
        return self::query()->ofSessions([$sessionId])->exists();
    }

    /**
     * Whether the session has a runtime and may still act: a runtime of an ended session takes no more work.
     */
    public static function canActForSession(string $sessionId): bool
    {
        return self::query()
            ->ofSessions([$sessionId])
            ->withRunningSession()
            ->exists();
    }

    /**
     * The host the session's runtime ran on, or none when it never opened one.
     *
     * @return Option<string>
     */
    public static function resolveHostOfSession(string $sessionId): Option
    {
        $hostId = self::query()->ofSessions([$sessionId])->value('host_id');

        return Option::fromValue($hostId);
    }

    /**
     * The session of the host's own runtime; another host's runtime is not found.
     */
    public static function resolveSessionOfHostRuntime(string $hostId, string $runtimeId): string
    {
        return self::query()->whereKey($runtimeId)->onHost($hostId)->firstOrFail()->agent_session_id;
    }

    /**
     * When the current process generation of the session's runtime began; none for a session the host never
     * started, such as one the owner runs in its own terminal.
     *
     * @return Option<CarbonImmutable>
     */
    public static function resolveGenerationStartOfSession(string $sessionId): Option
    {
        $runtime = self::query()->ofSessions([$sessionId])->first();

        return Option::fromValue($runtime?->generation_started_at);
    }

    /**
     * Whether the session's runtime is there and not already stopping or stopped.
     */
    public static function isRunningForSession(string $sessionId): bool
    {
        return self::query()
            ->ofSessions([$sessionId])
            ->notStopping()
            ->exists();
    }

    /**
     * The runtimes of the session's running helpers that are not stopping yet, each with its session.
     *
     * @return list<self>
     */
    public static function findRunningHelpersOf(string $sessionId): array
    {
        return array_values(self::query()
            ->with('session')
            ->notStopping()
            ->helpingSession($sessionId)
            ->get()
            ->all());
    }

    /**
     * Of the sessions given, those with a helper whose runtime is not proven stopped yet, so their own stop waits.
     *
     * @param  list<string>  $ids
     * @return list<string>
     */
    public static function resolveSessionsWaitingOnHelpers(array $ids): array
    {
        $sessionsWithRunningHelpers = AgentSession::query()
            ->helpersOfAny($ids)
            ->withLiveRuntime()
            ->pluck('parent_session_id')
            ->all();

        return array_values(array_filter($ids, fn (string $id) => in_array($id, $sessionsWithRunningHelpers, true)));
    }

    /**
     * The runtime of the session, locked for the change at hand.
     */
    public static function findLockedForSession(string $sessionId): self
    {
        return self::query()->ofAgentSession($sessionId)->lockForUpdate()->sole();
    }

    /**
     * The runtime of that session; none before the session opened one.
     */
    public static function findForSession(string $sessionId): self|null
    {
        return self::query()->ofSessions([$sessionId])->first();
    }

    /**
     * The driver key of each session's runtime, keyed by session; a session that opened no runtime is left out.
     *
     * @param  list<string>  $ids
     * @return array<string, string>
     */
    public static function resolveDriverKeysOfSessions(array $ids): array
    {
        return self::query()
            ->ofSessions($ids)
            ->limit(count($ids))
            ->pluck('driver_key', 'agent_session_id')
            ->map(fn (mixed $key) => (string) $key)
            ->all();
    }

    // ----------[ Scopes ]----------

    /**
     * Reads each runtime with how many live terminal views watch it.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withWatchers(Builder $query): void
    {
        $query->withCount(['terminalViews as watchers' => self::liveViews(...)]);
    }

    /**
     * The runtimes on the host.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function onHost(Builder $query, string $hostId): void
    {
        $query->where('host_id', $hostId);
    }

    /**
     * The runtimes of the sessions.
     *
     * @param  Builder<self>  $query
     * @param  array<array-key, string>|Builder<covariant Model>|Closure  $ids
     */
    #[Scope]
    protected function ofSessions(Builder $query, array|Builder|Closure $ids): void
    {
        $query->whereIn('agent_session_id', $ids);
    }

    /**
     * The runtimes whose session runs.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withRunningSession(Builder $query): void
    {
        $query->whereHas('session', fn (Builder $session) => $session->running());
    }

    /**
     * The runtimes neither stopping nor stopped.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function notStopping(Builder $query): void
    {
        $query->whereNotIn('activity', [RuntimeActivity::Stopping, RuntimeActivity::Stopped]);
    }

    /**
     * The runtimes not stopped.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function notStopped(Builder $query): void
    {
        $query->where('activity', '!=', RuntimeActivity::Stopped);
    }

    /**
     * The runtimes of the running helpers started under the session.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function helpingSession(Builder $query, string $sessionId): void
    {
        $query->whereHas('session', fn (Builder $helpers) => $helpers->helpersOfAny([$sessionId])->running());
    }

    /**
     * The rows of the given agent session.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofAgentSession(Builder $query, string $sessionId): void
    {
        $query->where('agent_session_id', $sessionId);
    }

    /**
     * The rows of any of the given hosts.
     *
     * @param  Builder<self>  $query
     * @param  array<array-key, string>|Builder<covariant Model>|Closure  $ids
     */
    #[Scope]
    protected function ofHosts(Builder $query, array|Builder|Closure $ids): void
    {
        $query->whereIn('host_id', $ids);
    }

    /**
     * The rows with their session loaded.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withSession(Builder $query): void
    {
        $query->with('session');
    }

    /**
     * The rows with their session's agent loaded.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withSessionAgent(Builder $query): void
    {
        $query->with('session.agent');
    }

    /**
     * Only the sessions of the runtimes, as a subquery.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function sessionIds(Builder $query): void
    {
        $query->select('agent_session_id');
    }

    /**
     * The runtimes with a request accepted and waiting.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withAcceptedRequest(Builder $query): void
    {
        $query->whereHas('requests', fn (Builder $requests) => $requests->where('progress', RequestProgress::Accepted));
    }

    /**
     * The runtimes no live worker drives: a worker claims its own runtime's requests, so the host's claim leaves them.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withoutDrivingWorker(Builder $query, CarbonImmutable $now): void
    {
        $query->whereDoesntHave('hostProcesses', fn (Builder $processes) => $processes->drivenAt($now));
    }

    /**
     * The runtimes of any driver but those named.
     *
     * @param  Builder<self>  $query
     * @param  list<string>  $keys
     */
    #[Scope]
    protected function exceptDrivers(Builder $query, array $keys): void
    {
        $query->whereNotIn('driver_key', $keys);
    }

    /**
     * @param  Builder<self>  $query
     * @param  array<array-key, string>|Builder<covariant Model>|Closure  $ids
     */
    #[Scope]
    protected function withIds(Builder $query, array|Builder|Closure $ids): void
    {
        $query->whereIn('id', $ids);
    }

    /**
     * The runtimes of the drivers named.
     *
     * @param  Builder<self>  $query
     * @param  list<string>  $keys
     */
    #[Scope]
    protected function ofDrivers(Builder $query, array $keys): void
    {
        $query->whereIn('driver_key', $keys);
    }
}
