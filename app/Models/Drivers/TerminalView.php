<?php

declare(strict_types=1);

namespace App\Models\Drivers;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\Runs\RuntimeActivity;
use App\Events\Sessions\TerminalViewClosed;
use App\Events\Sessions\TerminalViewFollowed;
use App\Models\Agents\AgentRuntime;
use App\Models\Support\BelongsToOneActor;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

/**
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $read_interest_id
 * @property string $open_request_id
 * @property string $agent_runtime_id
 * @property int $process_generation
 * @property int $interval_ms
 * @property CarbonImmutable $expires_at
 * @property CarbonImmutable|null $closed_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read AgentRuntime|null $runtime
 *
 * @mixin \Eloquent
 */
final class TerminalView extends Model implements EventSource, ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * How long a view stays live after it was opened or last renewed.
     */
    public const int LEASE_SECONDS = 30;

    /**
     * How long an ended view is kept before the engine deletes it.
     */
    public const int KEEP_ENDED_HOURS = 24;

    /**
     * How many live views one viewer may hold at once.
     */
    public const int MAX_PER_VIEWER = 20;

    /**
     * The capture intervals a view may ask the host for, in milliseconds.
     *
     * @var list<int>
     */
    public const array INTERVALS_MS = [
        500,
        1000,
    ];

    public const int DEFAULT_INTERVAL_MS = 500;

    /**
     * How many random characters a read interest id has.
     */
    public const int READ_INTEREST_LENGTH = 40;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'process_generation' => 'integer',
            'interval_ms' => 'integer',
            'expires_at' => 'immutable_datetime',
            'closed_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * Opens the viewer's lease on the runtime as it runs now, live for one lease from now.
     */
    public static function create(
        ActorIdentity $viewer,
        AgentRuntime $runtime,
        int $intervalMs,
        CarbonImmutable $now,
        string $openRequestId,
    ): self {
        $view = new self();
        $view->belongTo($viewer);
        $view->read_interest_id = Str::random(self::READ_INTEREST_LENGTH);
        $view->open_request_id = $openRequestId;
        $view->agent_runtime_id = $runtime->id;
        $view->process_generation = $runtime->process_generation;
        $view->interval_ms = $intervalMs;
        $view->expires_at = $now->addSeconds(self::LEASE_SECONDS);
        $view->save();

        return $view;
    }

    // ----------[ Mutations ]----------

    /**
     * Moves the view to the runtime the agent runs in now, at that runtime's generation.
     */
    public function follow(AgentRuntime $runtime): void
    {
        $this->agent_runtime_id = $runtime->id;
        $this->process_generation = $runtime->process_generation;
        $this->assertSaved($this->save());
        $this->raise(new TerminalViewFollowed($this->id, $runtime->id));
    }

    public function close(CarbonImmutable $now): void
    {
        $this->closed_at = $now;
        $this->assertSaved($this->save());
        $this->raise(new TerminalViewClosed($this->id));
    }

    // ----------[ Predicates ]----------

    /**
     * Whether the view still watches the runtime as it ran when the view opened or last followed it.
     */
    public function watches(AgentRuntime $runtime): bool
    {
        return $this->agent_runtime_id === $runtime->id && $this->process_generation === $runtime->process_generation;
    }

    /**
     * Whether the view watched a session the agent no longer runs, as after a switch: such a view ends rather than
     * follow the replacement, which a restart of the same session's process does.
     */
    public function hasWatchedAnotherSession(AgentRuntime $runtime): bool
    {
        return $this->runtime->agent_session_id !== $runtime->agent_session_id;
    }

    public function isLive(): bool
    {
        return $this->closed_at === null;
    }

    /**
     * Whether the view was closed or its lease ran out unrenewed by the given time.
     */
    public function hasEndedAt(CarbonImmutable $now): bool
    {
        return ! $this->isLive() || $this->expires_at->lessThan($now);
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<AgentRuntime, $this>
     */
    public function runtime(): BelongsTo
    {
        return $this->belongsTo(AgentRuntime::class, 'agent_runtime_id');
    }

    // ----------[ Queries ]----------

    /**
     * Keeps the view live for one lease from now.
     */
    public function renew(CarbonImmutable $now): void
    {
        $this->expires_at = $now->addSeconds(self::LEASE_SECONDS);
        $this->save();
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function live(Builder $query): void
    {
        $query->whereNull('closed_at');
    }

    /**
     * One row per runtime of the host with a view not ended, carrying the shortest interval its views ask for.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function watchedOnHost(Builder $query, string $hostId): void
    {
        $query->whereNull('closed_at')
            ->whereHas('runtime', fn (Builder $runtime) => $runtime->where('host_id', $hostId))
            ->select('agent_runtime_id')
            ->selectRaw('min(interval_ms) as interval_ms')
            ->groupBy('agent_runtime_id')
            ->orderBy('agent_runtime_id');
    }

    /**
     * Views of any runtime of the agent.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function ofAgent(Builder $query, string $agentId): void
    {
        $query->whereHas(
            'runtime',
            fn (Builder $runtime) => $runtime->whereHas(
                'session',
                fn (Builder $session) => $session->where('agent_id', $agentId),
            ),
        );
    }

    /**
     * The view that holds the read interest.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function withReadInterest(Builder $query, string $interestId): void
    {
        $query->where('read_interest_id', $interestId);
    }

    /**
     * The view the viewer's open request created.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function openedBy(Builder $query, string $requestId): void
    {
        $query->where('open_request_id', $requestId);
    }

    /**
     * Live views whose lease ran out unrenewed.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function lapsed(Builder $query, CarbonImmutable $now): void
    {
        $query->whereNull('closed_at')->where('expires_at', '<', $now);
    }

    /**
     * The rows of the given agent runtime.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofAgentRuntime(Builder $query, string $runtimeId): void
    {
        $query->where('agent_runtime_id', $runtimeId);
    }

    /**
     * The rows with their runtime loaded.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withRuntime(Builder $query): void
    {
        $query->with('runtime');
    }

    /**
     * The views of a runtime that stopped.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofStoppedRuntime(Builder $query): void
    {
        $query->whereHas('runtime', fn (Builder $runtime) => $runtime->where('activity', RuntimeActivity::Stopped));
    }

    /**
     * The views that closed or lapsed before the cutoff.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function endedBefore(Builder $query, CarbonImmutable $cutoff): void
    {
        $query->where(
            fn (Builder $ended) => $ended->where('closed_at', '<', $cutoff)->orWhere('expires_at', '<', $cutoff),
        );
    }
}
