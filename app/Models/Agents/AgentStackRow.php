<?php

declare(strict_types=1);

namespace App\Models\Agents;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\SessionStatus;
use App\Enums\StackStatus;
use App\Events\Engine\AgentStackClosed;
use App\Events\Engine\AgentStackFramesSaved;
use App\Events\Engine\AgentStackHeldForInvestigation;
use App\Events\Engine\AgentStackStarted;
use App\Exceptions\StackAlreadyClosed;
use App\Exceptions\StackMissing;
use App\Models\Support\Accessor;
use App\Models\Support\AgentSessionScope;
use App\Support\ActorIdentity;
use App\Support\Storage\FrameRecords;
use App\Support\Storage\FrameRecordsCast;
use App\Support\Storage\StoredFrames;
use App\Support\Ticks\TickingTypes;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * @property string $id
 * @property string $agent_id
 * @property string $session_id
 * @property int $version
 * @property FrameRecords $frames
 * @property StackStatus $status
 * @property bool $has_ticking_frames
 * @property ?CarbonImmutable $closed_at
 * @property ?CarbonImmutable $held_at
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property mixed $target attribute
 */
#[Fillable([
    'version',
    'frames',
    'status',
    'closed_at',
    'has_ticking_frames',
])]
final class AgentStackRow extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

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

    // ----------[ Constructors ]----------

    /**
     * Inserts the stack of the target unless one exists, and answers whether this insert won; a racing insert is
     * skipped by the database, never raised.
     */
    public static function create(StackTarget $target, FrameRecords $frames, TickingTypes $ticking): bool
    {
        $row = new self();

        $row->setRawAttributes([
            'id' => $row->newUniqueId(),
            'agent_id' => $target->agentId,
            'session_id' => $target->sessionId,
            'version' => 1,
            'frames' => StoredFrames::fromFrameRecords($frames)->toJson(),
            'status' => StackStatus::Active->value,
            'has_ticking_frames' => $frames->holdTicking($ticking),
        ]);

        return $row->insertIfAbsent();
    }

    // ----------[ Mutations ]----------

    public function startFor(StackTarget $target, FrameRecords $frames, TickingTypes $ticking): void
    {
        $this->agent_id = $target->agentId;
        $this->session_id = $target->sessionId;
        $this->version = 1;
        $this->frames = $frames;
        $this->has_ticking_frames = $frames->holdTicking($ticking);
        $this->status = StackStatus::Active;
        $this->assertSaved($this->save());
        $this->raise(new AgentStackStarted($this->id));
    }

    /**
     * Keeps this stack and its hook calls past their retention, for an investigation.
     */
    public function holdForInvestigation(CarbonImmutable $time): void
    {
        $this->held_at = $time;
        $this->assertSaved($this->save());
        $this->raise(new AgentStackHeldForInvestigation($this->id));
    }

    public function saveFrames(FrameRecords $frames, TickingTypes $ticking): void
    {
        $this->frames = $frames;
        $this->has_ticking_frames = $frames->holdTicking($ticking);
        $this->version++;
        $this->assertSaved($this->save());
        $this->raise(new AgentStackFramesSaved($this->id));
    }

    public function closeAt(CarbonImmutable $time): void
    {
        $this->status = StackStatus::Closed;
        $this->closed_at = $time;
        $this->assertSaved($this->save());
        $this->raise(new AgentStackClosed($this->id));
    }

    public function isActive(): bool
    {
        return $this->status === StackStatus::Active;
    }

    // ----------[ Accessors ]----------

    /**
     * The agent and session whose stack this is.
     *
     * @return Attribute<StackTarget, never>
     */
    protected function target(): Attribute
    {
        return Accessor::get(fn () => new StackTarget($this->agent_id, $this->session_id));
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses a stack that is already closed.
     *
     * @throws StackAlreadyClosed
     */
    private function assertOpen(StackTarget $target): void
    {
        if (! $this->isActive()) {
            throw StackAlreadyClosed::forTarget($target->description());
        }
    }

    // ----------[ Queries ]----------

    /**
     * The active stack of the target as the caller may read it, unlocked; none when it is missing or closed.
     *
     * @return Option<self>
     */
    public static function activeFor(StackTarget $target): Option
    {
        $row = self::query()->forTarget($target)->first();

        if ($row !== null && $row->isActive()) {
            return new Some($row);
        }

        return None::create();
    }

    /**
     * The active stack of a target the caller was authorized for, unlocked; none when it is missing or closed.
     *
     * @return Option<self>
     */
    public static function activeAuthorizedFor(StackTarget $target): Option
    {
        $row = self::query()->authorizedFor($target)->first();

        if ($row !== null && $row->isActive()) {
            return new Some($row);
        }

        return None::create();
    }

    /**
     * @return Option<self>
     */
    public static function lockActiveAuthorizedFor(StackTarget $target): Option
    {
        $row = self::query()->authorizedFor($target)->lockForUpdate()->first();

        if ($row !== null && $row->isActive()) {
            return new Some($row);
        }

        return None::create();
    }

    /**
     * The agent's most recently closed stack in another session: the one a continued session carries work from.
     *
     * @return Option<self>
     */
    public static function lastClosedBefore(StackTarget $target): Option
    {
        return Option::fromValue(self::query()
            ->withoutGlobalScope(AgentSessionScope::class)
            ->ofAgentOutsideSession($target)
            ->inStatus(StackStatus::Closed)
            ->lastClosedFirst()
            ->first());
    }

    /**
     * The active stack of the target, locked for this transaction.
     */
    public static function lockFor(StackTarget $target): self
    {
        $row = self::query()
            ->forTarget($target)
            ->lockForUpdate()
            ->firstOr(StackMissing::throwing()->forTarget($target->description()));
        $row->assertOpen($target);

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
        return $query->lockForUpdate()->firstOr(StackMissing::throwing()->forTarget($target->description()));
    }

    /**
     * The active stack of a target the caller was authorized for (its start, or a user acting on it), read through
     * the explicit authorized query and locked.
     */
    public static function lockAuthorizedFor(StackTarget $target): self
    {
        $row = self::query()
            ->authorizedFor($target)
            ->lockForUpdate()
            ->firstOr(StackMissing::throwing()->forTarget($target->description()));
        $row->assertOpen($target);

        return $row;
    }

    /**
     * @param  list<string>  $sessions
     * @return list<self>
     */
    public static function lockActiveOf(ActorIdentity $actor, array $sessions): array
    {
        if ($sessions === []) {
            return [];
        }

        return array_values(self::query()->historyOf($actor)->ofSessions($sessions)
            ->inStatus(StackStatus::Active)
            ->inSessionOrder()->lockForUpdate()->readExactly(count($sessions))->get()->all());
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function historyOf(Builder $query, ActorIdentity $actor): void
    {
        $query->withoutGlobalScope(AgentSessionScope::class)->where('agent_id', $actor->id);
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
     * The targets of every active stack whose session runs and that holds a frame of one of the state types, of any
     * agent: the stacks a fact reaches because one of their states listens for it.
     *
     * @param  list<string>  $typeKeys
     * @return list<StackTarget>
     */
    public static function targetsHolding(array $typeKeys): array
    {
        $targets = [];

        self::query()->runningOpen()->readInChunks(100, function ($rows) use ($typeKeys, &$targets): void {
            foreach ($rows as $row) {
                if ($row->frames->holdAnyOf($typeKeys)) {
                    $targets[] = $row->target;
                }
            }
        });

        return $targets;
    }

    /**
     * The engine's read of every active stack that holds a ticking frame and whose session still runs, of any agent.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function tickingOpen(Builder $query): void
    {
        $query->runningOpen()->where('has_ticking_frames', true);
    }

    /**
     * Every active stack whose session still runs, of any agent.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function runningOpen(Builder $query): void
    {
        $query->withoutGlobalScope(AgentSessionScope::class)
            ->where('status', StackStatus::Active->value)
            ->whereIn(
                'session_id',
                AgentSession::query()->select('id')->withAnyStatus(array_map(fn (SessionStatus $status) => $status->value, SessionStatus::running())),
            );
    }

    /**
     * The administrator's read across every agent and session, which lifts the current-agent limit.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function acrossEveryAgent(Builder $query): void
    {
        $query->withoutGlobalScope(AgentSessionScope::class);
    }

    /**
     * The administrator's read of closed stacks past their retention, across every agent; held stacks are left out.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function prunableBefore(Builder $query, CarbonImmutable $cutoff): void
    {
        $query->acrossEveryAgent()
            ->where('status', StackStatus::Closed->value)
            ->where('closed_at', '<', $cutoff)
            ->whereNull('held_at');
    }

    /**
     * The explicit read of another agent or session's stack, for a caller the user authorized; it lifts the
     * current-agent limit.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function authorizedFor(Builder $query, StackTarget $target): void
    {
        $query->withoutGlobalScope(AgentSessionScope::class)->forTarget($target);
    }

    /**
     * The target agent's stacks of other sessions than the target's.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofAgentOutsideSession(Builder $query, StackTarget $target): void
    {
        $query->where('agent_id', $target->agentId)->where('session_id', '!=', $target->sessionId);
    }

    /**
     * The stacks in that status.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inStatus(Builder $query, StackStatus $status): void
    {
        $query->where('status', $status->value);
    }

    /**
     * The stacks closed last first.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function lastClosedFirst(Builder $query): void
    {
        $query->orderByDesc('closed_at');
    }

    /**
     * The stacks of the sessions.
     *
     * @param  Builder<self>  $query
     * @param  list<string>  $sessions
     */
    #[Scope]
    protected function ofSessions(Builder $query, array $sessions): void
    {
        $query->whereIn('session_id', $sessions);
    }

    /**
     * The stacks in the order of their session.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inSessionOrder(Builder $query): void
    {
        $query->orderBy('session_id');
    }
}
