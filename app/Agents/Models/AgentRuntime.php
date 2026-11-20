<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Agents\Data\RuntimeSetting;
use App\Agents\Data\RuntimeStatus;
use App\Agents\Enums\DriverOperation;
use App\Agents\Enums\DriverType;
use App\Agents\Enums\HoldReason;
use App\Agents\Enums\RequestProgress;
use App\Agents\Enums\RuntimeActivity;
use App\Agents\Support\RuntimeIntent;
use App\Links\Support\Linkable;
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
use Illuminate\Support\Carbon;
use PhpOption\Option;

/**
 * The running program behind one agent session on one host: its driver, activity and hold, the requested, staged
 * and observed model and effort, and its process generation. AgentSession stays the only presence timestamp.
 *
 * @property string $id
 * @property string $agent_session_id
 * @property string $host_id
 * @property DriverType $driver_type
 * @property string $program
 * @property string $program_build
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
 * @property Carbon $updated_at
 * @property int $row_version
 */
#[Fillable(['agent_session_id', 'host_id', 'driver_type', 'program', 'program_build', 'profile', 'canonical_folder'])]
final class AgentRuntime extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

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
            'start_grant' => 'encrypted',
            'activity' => RuntimeActivity::class,
            'hold_reason' => HoldReason::class,
            'settings_observed_at' => 'immutable_datetime',
            'last_observed_at' => 'immutable_datetime',
            'generation_started_at' => 'immutable_datetime',
        ];
    }

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

    public static function forIntent(AgentSession $session, RuntimeIntent $intent): self
    {
        $runtime = new self();
        $runtime->agent_session_id = $session->id;
        $runtime->host_id = $intent->hostId;
        $runtime->driver_type = $intent->driverType;
        $runtime->program = $intent->program;
        $runtime->program_build = $intent->programBuild;
        $runtime->profile = $intent->profile;
        $runtime->canonical_folder = $intent->folder;
        $runtime->requested_model = $intent->model;
        $runtime->requested_effort = $intent->effort;

        return $runtime;
    }

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
     * The live terminal views of any viewer, which is what a runtime's watcher count counts.
     *
     * @param  Builder<TerminalView>  $views
     */
    private static function liveViews(Builder $views): void
    {
        $views->acrossActors()->live();
    }

    /**
     * Whether the runtime's program draws a screen a viewer can watch: only a terminal runtime does.
     */
    public function hasScreen(): bool
    {
        return $this->driver_type === DriverType::Terminal;
    }

    /**
     * Whether the runtime is stopping or stopped.
     */
    public function hasEnded(): bool
    {
        return in_array($this->activity, [RuntimeActivity::Stopping, RuntimeActivity::Stopped], true);
    }

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

        $open = $this->requests()
            ->whereIn('progress', RequestProgress::open())
            ->readAll('every open request of a runtime that exited gets its final outcome')
            ->get();

        foreach ($open as $request) {
            $request->settleAfterExit();
        }
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
        $this->row_version++;
        $this->save();

        return true;
    }

    /**
     * Records the model and effort the program reports it runs with now.
     */
    public function observeSettings(string|null $model, string|null $effort, CarbonImmutable $at): void
    {
        $this->observed_model = $model ?? $this->observed_model;
        $this->observed_effort = $effort ?? $this->observed_effort;
        $this->settings_observed_at = $at;
        $this->save();
    }

    /**
     * Seconds since the host last reported on this runtime, or null when it never did.
     */
    public function observationAge(CarbonImmutable $now): int|null
    {
        return $this->last_observed_at === null ? null : (int) $this->last_observed_at->diffInSeconds($now, true);
    }

    /**
     * The runtime as stored, read at the given time: its settings in their three states and how old its facts are.
     */
    public function status(CarbonImmutable $now): RuntimeStatus
    {
        $settingsAge = $this->settings_observed_at === null ? null : (int) $this->settings_observed_at->diffInSeconds(
            $now,
            true,
        );

        return RuntimeStatus::from([
            'runtimeId' => $this->id,
            'agentId' => $this->session->agent_id,
            'sessionId' => $this->agent_session_id,
            'program' => $this->program,
            'activity' => $this->activity,
            'hold' => $this->hold_reason,
            'model' => self::setting($this->requested_model, $this->staged_model, $this->observed_model, $settingsAge),
            'effort' => self::setting(
                $this->requested_effort,
                $this->staged_effort,
                $this->observed_effort,
                $settingsAge,
            ),
            'observationAgeSeconds' => $this->observationAge($now),
            'isStale' => $this->isStale($now),
            'processGeneration' => $this->process_generation,
            'canReleaseHold' => $this->canReleaseHold(),
            'driverType' => $this->driver_type,
            'watchers' => $this->watcherCount(),
        ]);
    }

    /**
     * One setting in its three states; a state the runtime has no value for is left out.
     */
    private static function setting(
        string|null $requested,
        string|null $staged,
        string|null $observed,
        int|null $observedAgeSeconds,
    ): RuntimeSetting {
        $known = compact('requested', 'staged', 'observed', 'observedAgeSeconds');

        return RuntimeSetting::from(array_filter($known, fn (string|int|null $setting) => $setting !== null));
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
     * Whether a user may release the runtime's hold: an interrupt or a call for attention. A hold the program
     * itself shows, such as compacting or a login, ends only on the program's own evidence.
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

    public function isAtGeneration(int $processGeneration): bool
    {
        return $this->process_generation === $processGeneration;
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

    /**
     * The runtime of that session; none before the session opened one.
     */
    public static function ofSession(string $sessionId): self|null
    {
        return self::query()->where('agent_session_id', $sessionId)->first();
    }
}
