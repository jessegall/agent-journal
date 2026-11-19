<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Actors\Models\Support\BelongsToOneActor;
use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * One viewer's lease on watching a runtime's terminal: live until it is closed or lapses unrenewed, and never a
 * request to the program.
 *
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $agent_runtime_id
 * @property int $process_generation
 * @property int $interval_ms
 * @property CarbonImmutable $expires_at
 * @property CarbonImmutable|null $closed_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
final class TerminalView extends Model implements ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasUlids;
    use Linkable;

    /**
     * How long a view stays live after it was opened or last renewed.
     */
    public const int LEASE_SECONDS = 30;

    /**
     * How many live views one viewer may hold at once.
     */
    public const int MAX_PER_VIEWER = 20;

    /**
     * The capture intervals a view may ask the host for, in milliseconds; the first is the default.
     *
     * @var list<int>
     */
    public const array INTERVALS_MS = [500, 1000];

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

    /**
     * Opens the viewer's lease on the runtime as it runs now, live for one lease from now.
     */
    public static function open(
        ActorIdentity $viewer,
        AgentRuntime $runtime,
        int $intervalMs,
        CarbonImmutable $now,
    ): self {
        $view = new self();
        $view->belongTo($viewer);
        $view->agent_runtime_id = $runtime->id;
        $view->process_generation = $runtime->process_generation;
        $view->interval_ms = $intervalMs;
        $view->expires_at = $now->addSeconds(self::LEASE_SECONDS);
        $view->save();

        return $view;
    }

    /**
     * @return BelongsTo<AgentRuntime, $this>
     */
    public function runtime(): BelongsTo
    {
        return $this->belongsTo(AgentRuntime::class, 'agent_runtime_id');
    }

    /**
     * Keeps the view live for one lease from now.
     */
    public function renew(CarbonImmutable $now): void
    {
        $this->expires_at = $now->addSeconds(self::LEASE_SECONDS);
        $this->save();
    }

    public function close(CarbonImmutable $now): void
    {
        $this->closed_at = $now;
        $this->save();
    }

    public function isLive(): bool
    {
        return $this->closed_at === null;
    }

    /**
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function live(Builder $query): void
    {
        $query->whereNull('closed_at');
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
}
