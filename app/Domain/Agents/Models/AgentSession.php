<?php

declare(strict_types=1);

namespace App\Domain\Agents\Models;

use App\Domain\Agents\SessionStatus;
use App\Domain\Links\Linkable;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Agent $agent
 */
#[Fillable(['program', 'program_session_id'])]
final class AgentSession extends Model
{
    use Linkable;

    public function startFor(Agent $agent, ?self $parent): void
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

    public function isActive(): bool
    {
        return $this->status === SessionStatus::Active;
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
        ];
    }
}
