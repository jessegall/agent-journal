<?php

declare(strict_types=1);

namespace App\Core\Hooks\Models;

use App\Core\Hooks\Exceptions\StackAlreadyClosed;
use App\Core\Hooks\Exceptions\StackMissing;
use App\Core\Hooks\Models\Support\AgentSessionScope;
use App\Core\Hooks\Storage\FrameRecords;
use App\Core\Hooks\Storage\FrameRecordsCast;
use App\Core\Hooks\Storage\StackStatus;
use App\Core\Hooks\Storage\StoredFrames;
use App\Core\Hooks\Support\StackTarget;
use App\Core\Links\Support\Linkable;
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
 * @property CarbonImmutable|null $held_at
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

    /**
     * Inserts the stack of the target unless one exists; a racing insert is skipped by the database, never raised.
     */
    public static function insertIfMissing(StackTarget $target, FrameRecords $frames): void
    {
        $now = CarbonImmutable::now();

        self::query()->withoutGlobalScope(AgentSessionScope::class)->insertOrIgnore([
            'agent_id' => $target->agentId,
            'session_id' => $target->sessionId,
            'version' => 1,
            'frames' => StoredFrames::fromFrameRecords($frames)->toJson(),
            'status' => StackStatus::Active->value,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }

    /**
     * The active stack of the target, locked for this transaction.
     */
    public static function lockFor(StackTarget $target): self
    {
        $row = self::query()->forTarget($target)->lockForUpdate()->first() ?? throw StackMissing::forTarget($target->description());

        if (! $row->isActive()) {
            throw StackAlreadyClosed::forTarget($target->description());
        }

        return $row;
    }

    /**
     * The active stack of a target the caller was authorized for (its launch, or a user acting on it), read through
     * the explicit authorized query and locked.
     */
    public static function lockAuthorizedFor(StackTarget $target): self
    {
        $row = self::query()->authorizedFor($target)->lockForUpdate()->first() ?? throw StackMissing::forTarget($target->description());

        if (! $row->isActive()) {
            throw StackAlreadyClosed::forTarget($target->description());
        }

        return $row;
    }

    public function isActive(): bool
    {
        return $this->status === StackStatus::Active;
    }

    /**
     * Keeps this stack and its hook calls past their retention, for an investigation.
     */
    public function holdForInvestigation(CarbonImmutable $time): void
    {
        $this->held_at = $time;
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
            'held_at' => 'immutable_datetime',
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

    /**
     * The administrator's read of closed stacks past their retention, across every agent; held stacks are left out.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function prunableBefore(Builder $query, CarbonImmutable $cutoff): void
    {
        $query->withoutGlobalScope(AgentSessionScope::class)
            ->where('status', StackStatus::Closed->value)
            ->where('closed_at', '<', $cutoff)
            ->whereNull('held_at');
    }

    /**
     * The explicit read of another agent or session's stack, for a caller the user authorized; it lifts the current-agent limit.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function authorizedFor(Builder $query, StackTarget $target): void
    {
        $query->withoutGlobalScope(AgentSessionScope::class)->forTarget($target);
    }
}
