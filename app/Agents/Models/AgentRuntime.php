<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Agents\Data\RuntimeSetting;
use App\Agents\Data\RuntimeStatus;
use App\Agents\Enums\DriverType;
use App\Agents\Enums\HoldReason;
use App\Agents\Enums\RuntimeActivity;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;

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
    use Linkable;
    use BoundedReads;
    use HasUlids;

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

        return new RuntimeStatus(
            $this->id,
            $this->agent_session_id,
            $this->program,
            $this->activity,
            $this->hold_reason,
            new RuntimeSetting($this->requested_model, $this->staged_model, $this->observed_model, $settingsAge),
            new RuntimeSetting($this->requested_effort, $this->staged_effort, $this->observed_effort, $settingsAge),
            $this->observationAge($now),
            $this->isStale($now),
            $this->process_generation,
        );
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
