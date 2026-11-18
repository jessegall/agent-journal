<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Agents\Enums\SessionStatus;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * One launch of an agent: one journal session, its parent session for a child, and the program's own session once verified.
 *
 * @property string $id
 * @property string $agent_id
 * @property string|null $parent_session_id
 * @property string|null $program
 * @property string|null $program_session_id
 * @property SessionStatus $status
 * @property CarbonImmutable|null $ended_at
 * @property CarbonImmutable|null $last_heartbeat_at
 * @property CarbonImmutable|null $silent_since
 * @property string|null $end_evidence
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Agent $agent
 * @property-read LaunchCredential|null $credential
 */
#[Fillable(['program', 'program_session_id'])]
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
        ];
    }

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
     * Whether a message may still be addressed to this session: it is running or waiting, not ended or timed out.
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
     * A sign of life from the host: a silent session is active again.
     */
    public function recordHeartbeatAt(CarbonImmutable $time): void
    {
        $this->last_heartbeat_at = $time;
        $this->silent_since = null;
        $this->status = $this->status === SessionStatus::Silent ? SessionStatus::Active : $this->status;
        $this->save();
    }

    public function markSilentAt(CarbonImmutable $time): void
    {
        $this->status = SessionStatus::Silent;
        $this->silent_since = $time;
        $this->save();
    }

    public function markTimedOutAt(CarbonImmutable $time, string $evidence): void
    {
        $this->status = SessionStatus::TimedOut;
        $this->ended_at = $time;
        $this->end_evidence = $evidence;
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
}
