<?php

declare(strict_types=1);

namespace App\Models\Agents;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Data\Processes\RuntimeStatus;
use App\Enums\DriverOperation;
use App\Enums\DriverVariant;
use App\Enums\HoldReason;
use App\Enums\RequestProgress;
use App\Enums\RuntimeActivity;
use App\Enums\SessionStatus;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\TerminalView;
use App\Models\Projects\Host;
use App\Support\RuntimeStatuses;
use App\Values\PinnedDriver;
use App\Values\RuntimeIntent;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use PhpOption\Option;

/**
 * The running driver behind one agent session on one host: its driver, activity and hold, the requested, staged
 * and observed model and effort, and its process generation. AgentSession stays the only presence timestamp.
 *
 * @property string $id
 * @property string $agent_session_id
 * @property string $host_id
 * @property DriverVariant $mode
 * @property bool $remember
 * @property string $driver_key
 * @property string $family
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
 * @property Carbon $updated_at
 * @property int $row_version
 */
#[Fillable(['agent_session_id', 'host_id', 'mode', 'driver_key', 'driver_build', 'profile', 'canonical_folder'])]
final class AgentRuntime extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    /**
     * How old a host observation may be before the runtime's status is shown as stale.
     */
    public const int FRESH_SECONDS = 60;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'mode' => DriverVariant::class,
            'has_screen' => 'boolean',
            'start_grant' => 'encrypted',
            'activity' => RuntimeActivity::class,
            'hold_reason' => HoldReason::class,
            'settings_observed_at' => 'immutable_datetime',
            'last_observed_at' => 'immutable_datetime',
            'generation_started_at' => 'immutable_datetime',
        ];
    }

    public static function create(AgentSession $session, RuntimeIntent $intent, PinnedDriver $pin): self
    {
        $registration = $pin->registration;
        $runtime = new self();
        $runtime->agent_session_id = $session->id;
        $runtime->host_id = $intent->hostId;
        $runtime->mode = $intent->variant;
        $runtime->remember = $intent->savesVariant;
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

    // ----------[ Queries ]----------

    /**
     * The runtime a session opens on a host, as its intent describes it, not saved yet.
     */
    public static function existsForSession(string $sessionId): bool
    {
        return self::query()->where('agent_session_id', $sessionId)->exists();
    }

    /**
     * The host the session's runtime ran on, or none when it never opened one.
     *
     * @return Option<string>
     */
    public static function hostOfSession(string $sessionId): Option
    {
        return Option::fromValue(self::query()->where('agent_session_id', $sessionId)->value('host_id'));
    }

    /**
     * The session of the host's own runtime; another host's runtime is not found.
     */
    public static function sessionOfHostRuntime(string $hostId, string $runtimeId): string
    {
        return self::query()->whereKey($runtimeId)->where('host_id', $hostId)->firstOrFail()->agent_session_id;
    }

    /**
     * When the current process generation of the session's runtime began; none for a session the host never
     * started, such as one the owner runs in its own terminal.
     *
     * @return Option<CarbonImmutable>
     */
    public static function generationStartOfSession(string $sessionId): Option
    {
        $runtime = self::query()->where('agent_session_id', $sessionId)->first();

        return Option::fromValue($runtime?->generation_started_at);
    }

    /**
     * Whether the session's runtime is there and not already stopping or stopped.
     */
    public static function isRunningForSession(string $sessionId): bool
    {
        return self::query()
            ->where('agent_session_id', $sessionId)
            ->whereNotIn('activity', [RuntimeActivity::Stopping, RuntimeActivity::Stopped])
            ->exists();
    }

    /**
     * The runtimes of the session's running helpers that are not stopping yet, each with its session.
     *
     * @return list<self>
     */
    public static function runningHelpersOf(string $sessionId): array
    {
        return array_values(self::query()
            ->with('session')
            ->whereNotIn('activity', [RuntimeActivity::Stopping, RuntimeActivity::Stopped])
            ->whereHas('session', fn (Builder $sessions) => $sessions
                ->where('parent_session_id', $sessionId)
                ->whereIn('status', SessionStatus::running()))
            ->readAll('every running helper of one session is stopped before the session itself')
            ->get()
            ->all());
    }

    /**
     * Of the sessions given, those with a helper whose runtime is not proven stopped yet, so their own stop waits.
     *
     * @param  list<string>  $ids
     * @return list<string>
     */
    public static function sessionsWaitingOnHelpers(array $ids): array
    {
        $sessionsWithRunningHelpers = AgentSession::query()
            ->whereIn('parent_session_id', $ids)
            ->whereIn(
                'id',
                self::query()->where('activity', '!=', RuntimeActivity::Stopped)->select('agent_session_id'),
            )
            ->readAll('every helper still running holds back the stop of the session it helps')
            ->pluck('parent_session_id')
            ->all();

        return array_values(array_filter($ids, fn (string $id) => in_array($id, $sessionsWithRunningHelpers, true)));
    }

    /**
     * The runtime of that session; none before the session opened one.
     */
    public static function ofSession(string $sessionId): self|null
    {
        return self::query()->where('agent_session_id', $sessionId)->first();
    }

    /**
     * The driver key of each session's runtime, keyed by session; a session that opened no runtime is left out.
     *
     * @param  list<string>  $ids
     * @return array<string, string>
     */
    public static function driverKeysOfSessions(array $ids): array
    {
        return self::query()
            ->whereIn('agent_session_id', $ids)
            ->limit(count($ids))
            ->pluck('driver_key', 'agent_session_id')
            ->map(fn (mixed $key) => (string) $key)
            ->all();
    }

    // ----------[ Mutations ]----------

    /**
     * A stop was asked for: the runtime takes no more requests while it stops.
     */
    public function markStopping(): void
    {
        $this->activity = RuntimeActivity::Stopping;
        $this->save();
    }

    /**
     * Holds the runtime's normal work for the reason given.
     */
    public function holdFor(HoldReason $reason): void
    {
        $this->hold_reason = $reason;
        $this->save();
    }

    /**
     * The process ended for good: the runtime is stopped and every request still open gets its final outcome, a
     * stop as applied and anything else as unavailable.
     */
    public function closeAfterExit(): void
    {
        $this->activity = RuntimeActivity::Stopped;
        $this->save();
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
        $this->save();
    }

    /**
     * The host proved the runtime's process still lives: what it last reported still holds, so the report is fresh
     * again. An idle runtime reports nothing else between two turns.
     */
    public function confirmAlive(CarbonImmutable $at): void
    {
        $this->last_observed_at = $at;
        $this->row_version++;
        $this->save();
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
        $this->save();

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
        $this->save();
    }

    /**
     * Keeps the start token for the host's one start grant; it is encrypted at rest and cleared when claimed.
     */
    public function holdStartGrant(string $token): void
    {
        $this->start_grant = $token;
        $this->save();
    }

    /**
     * Hands the start token over once: the first claim gets it and clears it, any later claim gets nothing.
     */
    public function claimStartGrant(): string|null
    {
        $token = $this->start_grant;
        $this->start_grant = null;
        $this->save();

        return $token;
    }

    /**
     * The requested model and effort again, from the newest setting request of each that is still open, after one
     * was cancelled; none open leaves nothing requested.
     */
    public function recomputeRequestedSettings(): void
    {
        $open = $this->requests()
            ->whereIn('progress', RequestProgress::open())
            ->whereIn('operation', [DriverOperation::ChangeModel, DriverOperation::ChangeEffort])
            ->orderBy('sequence')
            ->readAll('the open setting requests of one runtime decide what it has requested')
            ->get();

        $this->requested_model = $open->where('operation', DriverOperation::ChangeModel)->last()?->model;
        $this->requested_effort = $open->where('operation', DriverOperation::ChangeEffort)->last()?->effort;
        $this->save();
    }

    /**
     * Moves the runtime to a new process generation on the given host, starting again with nothing held and the
     * rotated credential waiting for that host's start grant; reports of the old generation are refused after it.
     */
    public function reassignTo(string $hostId, string $startToken): void
    {
        $this->host_id = $hostId;
        $this->process_generation++;
        $this->activity = RuntimeActivity::Starting;
        $this->hold_reason = HoldReason::None;
        $this->start_grant = $startToken;
        $this->save();
    }

    public function requestModel(string $model): void
    {
        $this->requested_model = $model;
        $this->save();
    }

    public function requestEffort(string $effort): void
    {
        $this->requested_effort = $effort;
        $this->save();
    }

    // ----------[ Answers ]----------

    /**
     * How many live terminal views watch the runtime, counted once with the runtime when it was read with its watchers.
     */
    public function watcherCount(): int
    {
        if (! array_key_exists('watchers', $this->getAttributes())) {
            $this->loadCount(['terminalViews as watchers' => self::liveViews(...)]);
        }

        return (int) $this->getAttribute('watchers');
    }

    /**
     * Whether the runtime's driver draws a screen a viewer can watch, as its pinned capabilities said.
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

        return $age === null || $age > self::FRESH_SECONDS;
    }

    /**
     * Whether a user may release the runtime's hold: an interrupt or a call for attention. A hold the driver
     * itself shows, such as compacting or a login, ends only on the driver's own evidence.
     */
    public function canReleaseHold(): bool
    {
        return in_array($this->hold_reason, [HoldReason::Interrupted, HoldReason::NeedsAttention], true);
    }

    public function isHeldFor(HoldReason $reason): bool
    {
        return $this->hold_reason === $reason;
    }

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

    public function isAtGeneration(int $processGeneration): bool
    {
        return $this->process_generation === $processGeneration;
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
     * @return BelongsTo<Host, $this>
     */
    public function host(): BelongsTo
    {
        return $this->belongsTo(Host::class);
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
        return $moment === null ? null : (int) $moment->diffInSeconds($now, true);
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
}
