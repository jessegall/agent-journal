<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Models;

use App\Domain\Hooks\Storage\FrameRecords;
use App\Domain\Hooks\Storage\FrameRecordsCast;
use App\Domain\Hooks\Storage\StackStatus;
use App\Domain\Hooks\Storage\StackTarget;
use App\Domain\Links\Linkable;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * The stored stack of one agent in one journal session. The agent and session are set only through startFor, never mass assigned.
 *
 * @property int $id
 * @property int $agent_id
 * @property int $session_id
 * @property int $version
 * @property FrameRecords $frames
 * @property StackStatus $status
 * @property CarbonImmutable|null $closed_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['version', 'frames', 'status', 'closed_at'])]
final class AgentStackRow extends Model
{
    use Linkable;

    protected $table = 'agent_stacks';

    public function startFor(StackTarget $target, FrameRecords $frames): void
    {
        $this->agent_id = $target->agentId;
        $this->session_id = $target->sessionId;
        $this->version = 1;
        $this->frames = $frames;
        $this->status = StackStatus::Active;
        $this->save();
    }

    public function saveFrames(FrameRecords $frames): void
    {
        $this->frames = $frames;
        $this->version++;
        $this->save();
    }

    public function closeAt(CarbonImmutable $time): void
    {
        $this->status = StackStatus::Closed;
        $this->closed_at = $time;
        $this->save();
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'agent_id' => 'integer',
            'session_id' => 'integer',
            'version' => 'integer',
            'frames' => FrameRecordsCast::class,
            'status' => StackStatus::class,
            'closed_at' => 'immutable_datetime',
        ];
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forTarget(Builder $query, StackTarget $target): void
    {
        $query->where('agent_id', $target->agentId)->where('session_id', $target->sessionId);
    }
}
