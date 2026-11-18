<?php

declare(strict_types=1);

namespace App\Hooks\Models;

use App\Agents\Enums\SessionStatus;
use App\Agents\Models\AgentSession;
use App\Agents\Support\StackTarget;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Enums\StackStatus;
use App\Hooks\Exceptions\StackAlreadyClosed;
use App\Hooks\Exceptions\StackMissing;
use App\Hooks\Models\Support\AgentSessionScope;
use App\Hooks\Storage\FrameRecords;
use App\Hooks\Storage\FrameRecordsCast;
use App\Hooks\Storage\StoredFrames;
use App\Hooks\Ticks\TickingTypes;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * The stored stack of one agent in one journal session. The agent and session are set only through startFor, never mass assigned.
 *
 * @property string $id
 * @property string $agent_id
 * @property string $session_id
 * @property int $version
 * @property FrameRecords $frames
 * @property StackStatus $status
 * @property bool $has_ticking_frames derived from the frames on every save; a change to a type's ticking mark needs
 *                                    migrate:fresh in development, since stored rows are never backfilled
 * @property CarbonImmutable|null $closed_at
 * @property CarbonImmutable|null $held_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['version', 'frames', 'status', 'closed_at', 'has_ticking_frames'])]
final class AgentStackRow extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids, Linkable;

    protected $table = 'agent_stacks';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'version' => 'integer',
            'frames' => FrameRecordsCast::class,
            'status' => StackStatus::class,
            'has_ticking_frames' => 'boolean',
            'closed_at' => 'immutable_datetime',
            'held_at' => 'immutable_datetime',
        ];
    }

    public function startFor(StackTarget $target, FrameRecords $frames, TickingTypes $ticking): void
    {
        $this->agent_id = $target->agentId;
        $this->session_id = $target->sessionId;
        $this->version = 1;
        $this->frames = $frames;
        $this->has_ticking_frames = $frames->holdTicking($ticking);
        $this->status = StackStatus::Active;
        $this->save();
    }

    /**
     * Inserts the stack of the target unless one exists; a racing insert is skipped by the database, never raised.
     */
    public static function insertIfMissing(StackTarget $target, FrameRecords $frames, TickingTypes $ticking): void
    {
        $now = CarbonImmutable::now();

        self::query()->withoutGlobalScope(AgentSessionScope::class)->insertOrIgnore([
            'id' => new self()->newUniqueId(),
            'agent_id' => $target->agentId,
            'session_id' => $target->sessionId,
            'version' => 1,
            'frames' => StoredFrames::fromFrameRecords($frames)->toJson(),
            'status' => StackStatus::Active->value,
            'has_ticking_frames' => $frames->holdTicking($ticking),
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
     * The target's stack as the given query finds it, open or closed, locked for this transaction: a closed stack is
     * history, kept as it is, while a missing one is refused.
     *
     * @param  Builder<self>  $query
     */
    public static function lockKeptFor(Builder $query, StackTarget $target): self
    {
        return $query->lockForUpdate()->first() ?? throw StackMissing::forTarget($target->description());
    }

    /**
     * The active stack of the target as the caller may read it, unlocked; none when it is missing or closed.
     *
     * @return Option<self>
     */
    public static function activeFor(StackTarget $target): Option
    {
        $row = self::query()->forTarget($target)->first();

        return $row !== null && $row->isActive() ? new Some($row) : None::create();
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

    public function saveFrames(FrameRecords $frames, TickingTypes $ticking): void
    {
        $this->frames = $frames;
        $this->has_ticking_frames = $frames->holdTicking($ticking);
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
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forTarget(Builder $query, StackTarget $target): void
    {
        $query->where('agent_id', $target->agentId)->where('session_id', $target->sessionId);
    }

    /**
     * The active stacks, of any agent, with a frame of this state about this subject run.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function holdingState(Builder $query, StateReference $state): void
    {
        $frame = $state->subject instanceof SubjectReference
            ? ['typeKey' => $state->typeKey, 'subject' => ['id' => $state->subject->id, 'runNumber' => $state->subject->runNumber]]
            : ['typeKey' => $state->typeKey];

        $query->withoutGlobalScope(AgentSessionScope::class)
            ->where('status', StackStatus::Active->value)
            ->whereRaw('frames @> ?::jsonb', [json_encode(['frames' => [$frame]], JSON_THROW_ON_ERROR)]);
    }

    /**
     * The engine's read of every active stack that holds a ticking frame and whose session still runs, of any agent.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function tickingOpen(Builder $query): void
    {
        $query->withoutGlobalScope(AgentSessionScope::class)
            ->where('status', StackStatus::Active->value)
            ->where('has_ticking_frames', true)
            ->whereIn('session_id', AgentSession::query()->select('id')->whereIn('status', array_map(fn (SessionStatus $status) => $status->value, SessionStatus::running())));
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
