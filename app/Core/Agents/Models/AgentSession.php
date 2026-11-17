<?php

declare(strict_types=1);

namespace App\Core\Agents\Models;

use App\Core\Agents\Enums\SessionStatus;
use App\Core\Links\Support\Linkable;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * One launch of an agent: one journal session, its parent session for a child, and the program's own session once verified.
 *
 * @property int $id
 * @property int $agent_id
 * @property int|null $parent_session_id
 * @property string|null $program
 * @property string|null $program_session_id
 * @property SessionStatus $status
 * @property CarbonImmutable|null $ended_at
 * @property CarbonImmutable|null $last_heartbeat_at
 * @property CarbonImmutable|null $suspected_lost_at
 * @property string|null $loss_evidence
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Agent $agent
 * @property-read LaunchCredential|null $credential
 */
#[Fillable(['program', 'program_session_id'])]
final class AgentSession extends Model
{
    use Linkable;

    public function startFor(Agent $agent, self|null $parent): void
    {
        $this->agent_id = $agent->id;
        $this->parent_session_id = $parent?->id;
        $this->status = SessionStatus::Active;
        $this->save();
    }

    public function useProgram(string $program): void
    {
        $this->program = $program;
        $this->save();
    }

    public function mapProgramSession(string $programSessionId): void
    {
        $this->program_session_id = $programSessionId;
        $this->save();
    }

    public function endAt(CarbonImmutable $time): void
    {
        $this->status = SessionStatus::Ended;
        $this->ended_at = $time;
        $this->save();
    }

    /**
     * Marks every running session that has shown no life since the cutoff as possibly lost, in one update.
     */
    public static function markPossiblyLostIfSilentSince(CarbonImmutable $cutoff, CarbonImmutable $now): void
    {
        self::query()->where('status', SessionStatus::Active->value)
            ->where(fn (Builder $silent) => $silent->where('last_heartbeat_at', '<=', $cutoff)
                ->orWhere(fn (Builder $neverBeat) => $neverBeat->whereNull('last_heartbeat_at')->where('created_at', '<=', $cutoff)))
            ->update(['status' => SessionStatus::PossiblyLost->value, 'suspected_lost_at' => $now]);
    }

    public function isActive(): bool
    {
        return $this->status->isRunning();
    }

    /**
     * A sign of life from the host: a session marked possibly lost is active again.
     */
    public function recordHeartbeatAt(CarbonImmutable $time): void
    {
        $this->last_heartbeat_at = $time;
        $this->suspected_lost_at = null;
        $this->status = $this->status === SessionStatus::PossiblyLost ? SessionStatus::Active : $this->status;
        $this->save();
    }

    public function markPossiblyLostAt(CarbonImmutable $time): void
    {
        $this->status = SessionStatus::PossiblyLost;
        $this->suspected_lost_at = $time;
        $this->save();
    }

    public function markLostAt(CarbonImmutable $time, string $evidence): void
    {
        $this->status = SessionStatus::Lost;
        $this->ended_at = $time;
        $this->loss_evidence = $evidence;
        $this->save();
    }

    /**
     * The moment the session last showed life: its last heartbeat, or its start.
     */
    public function lastSeenAt(): CarbonImmutable
    {
        return $this->last_heartbeat_at ?? CarbonImmutable::instance($this->created_at ?? CarbonImmutable::now());
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

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'agent_id' => 'integer',
            'parent_session_id' => 'integer',
            'status' => SessionStatus::class,
            'ended_at' => 'immutable_datetime',
            'last_heartbeat_at' => 'immutable_datetime',
            'suspected_lost_at' => 'immutable_datetime',
        ];
    }
}
