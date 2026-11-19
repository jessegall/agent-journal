<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Agents\Data\RuntimeSetting;
use App\Agents\Data\RuntimeStatus;
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
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
 * @property string|null $launch_grant
 * @property int $process_generation
 * @property CarbonImmutable|null $last_observed_at
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
            'launch_grant' => 'encrypted',
            'activity' => RuntimeActivity::class,
            'hold_reason' => HoldReason::class,
            'settings_observed_at' => 'immutable_datetime',
            'last_observed_at' => 'immutable_datetime',
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
        $this->save();
    }

    /**
     * Records what the host saw, unless the report comes from an older process generation than the one recorded.
     */
    public function recordObservation(RuntimeActivity $activity, HoldReason $hold, int $processGeneration, CarbonImmutable $at): bool
    {
        if ($processGeneration < $this->process_generation) {
            return false;
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
        $settingsAge = $this->settings_observed_at === null ? null : (int) $this->settings_observed_at->diffInSeconds($now, true);

        return RuntimeStatus::from([
            'runtimeId' => $this->id,
            'sessionId' => $this->agent_session_id,
            'program' => $this->program,
            'activity' => $this->activity,
            'hold' => $this->hold_reason,
            'model' => self::setting($this->requested_model, $this->staged_model, $this->observed_model, $settingsAge),
            'effort' => self::setting($this->requested_effort, $this->staged_effort, $this->observed_effort, $settingsAge),
            'observationAgeSeconds' => $this->observationAge($now),
            'isStale' => $this->isStale($now),
            'processGeneration' => $this->process_generation,
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

        return RuntimeSetting::from(array_filter($known, fn (string|int|null $value) => $value !== null));
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
     * Keeps the launch credential for the host's one launch grant; it is encrypted at rest and cleared when claimed.
     */
    public function holdLaunchGrant(string $token): void
    {
        $this->launch_grant = $token;
        $this->save();
    }

    /**
     * Hands the launch credential over once: the first claim gets it and clears it, any later claim gets nothing.
     */
    public function claimLaunchGrant(): string|null
    {
        $token = $this->launch_grant;
        $this->launch_grant = null;
        $this->save();

        return $token;
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
}
