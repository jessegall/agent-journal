<?php

declare(strict_types=1);

namespace App\Models\Drivers;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\Terminals\TerminalGrantStatus;
use App\Events\Sessions\TerminalGrantGivenBack;
use App\Events\Sessions\TerminalGrantIssued;
use App\Events\Sessions\TerminalGrantRefused;
use App\Events\Sessions\TerminalGrantReleased;
use App\Events\Sessions\TerminalGrantRenewed;
use App\Events\Sessions\TerminalGrantRetired;
use App\Events\Sessions\TerminalGrantSequenceTaken;
use App\Events\Sessions\TerminalTakeSent;
use App\Models\Agents\AgentRuntime;
use App\Models\Support\BelongsToOneActor;
use App\Support\ActorReference;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $agent_id
 * @property string $agent_runtime_id
 * @property string $agent_session_id
 * @property int $process_generation
 * @property string $host_id
 * @property string $read_interest_id
 * @property string $take_id
 * @property string|null $grant_id
 * @property TerminalGrantStatus $status
 * @property int $next_sequence
 * @property string|null $take_request_id
 * @property string|null $release_request_id
 * @property CarbonImmutable $expires_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read AgentRuntime|null $runtime
 *
 * @mixin \Eloquent
 */
final class TerminalGrant extends Model implements EventSource, ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * How long a grant lasts after its take or its last renewal, the host's own lifetime for it.
     */
    public const int LIFETIME_SECONDS = 30;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => TerminalGrantStatus::class,
            'process_generation' => 'integer',
            'next_sequence' => 'integer',
            'expires_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * The viewer's take of the runtime's input through their read interest, waiting for the host.
     */
    public static function create(
        ActorReference $writer,
        AgentRuntime $runtime,
        TerminalView $interest,
        string $takeId,
        CarbonImmutable $now,
    ): self {
        $grant = new self();
        $grant->belongTo($writer);
        $grant->agent_id = $runtime->session->agent_id;
        $grant->agent_runtime_id = $runtime->id;
        $grant->agent_session_id = $runtime->agent_session_id;
        $grant->process_generation = $runtime->process_generation;
        $grant->host_id = $runtime->host_id;
        $grant->read_interest_id = $interest->read_interest_id;
        $grant->take_id = $takeId;
        $grant->status = TerminalGrantStatus::Taking;
        $grant->expires_at = $now->addSeconds(self::LIFETIME_SECONDS);
        $grant->save();

        return $grant;
    }

    // ----------[ Mutations ]----------

    /**
     * Remembers the host request that carries the take, whose report issues or refuses the grant.
     */
    public function sendTakeWith(DriverRequest $request): void
    {
        $this->take_request_id = $request->id;
        $this->assertSaved($this->save());
        $this->raise(new TerminalTakeSent($this->id, $request->id));
    }

    /**
     * The host issued the grant under its opaque id.
     */
    public function issue(string $grantId): void
    {
        if ($this->status !== TerminalGrantStatus::Taking) {
            return;
        }

        $this->grant_id = $grantId;
        $this->status = TerminalGrantStatus::Granted;
        $this->assertSaved($this->save());
        $this->raise(new TerminalGrantIssued($this->id));
    }

    public function refuse(): void
    {
        $this->status = TerminalGrantStatus::Refused;
        $this->assertSaved($this->save());
        $this->raise(new TerminalGrantRefused($this->id));
    }

    public function renew(CarbonImmutable $now): void
    {
        $this->expires_at = $now->addSeconds(self::LIFETIME_SECONDS);
        $this->assertSaved($this->save());
        $this->raise(new TerminalGrantRenewed($this->id));
    }

    /**
     * The writer gave the input back, or cancelled the take; the host fences it before it counts as released.
     */
    public function release(DriverRequest $request): void
    {
        $this->status = TerminalGrantStatus::Releasing;
        $this->release_request_id = $request->id;
        $this->assertSaved($this->save());
        $this->raise(new TerminalGrantGivenBack($this->id, $request->id));
    }

    /**
     * The host fenced the grant: nothing more is written through it.
     */
    public function markReleased(): void
    {
        if ($this->status !== TerminalGrantStatus::Releasing) {
            return;
        }

        $this->status = TerminalGrantStatus::Released;
        $this->assertSaved($this->save());
        $this->raise(new TerminalGrantReleased($this->id));
    }

    /**
     * Access ended, the session was replaced or the grant expired: it accepts nothing more.
     */
    public function retire(DriverRequest $release): void
    {
        $this->status = TerminalGrantStatus::Retired;
        $this->release_request_id = $release->id;
        $this->assertSaved($this->save());
        $this->raise(new TerminalGrantRetired($this->id, $release->id));
    }

    /**
     * Takes the next input sequence of the grant and gives the one it took.
     */
    public function takeSequence(): int
    {
        $sequence = $this->next_sequence;
        $this->next_sequence++;
        $this->assertSaved($this->save());
        $this->raise(new TerminalGrantSequenceTaken($this->id, $sequence));

        return $sequence;
    }

    // ----------[ Predicates ]----------

    /**
     * Whether the grant may still write at the given time: issued, not expired, for the runtime as it runs now.
     */
    public function writesFor(AgentRuntime $runtime, CarbonImmutable $now): bool
    {
        return $this->status === TerminalGrantStatus::Granted
            && $this->expires_at->greaterThan($now)
            && $this->agent_runtime_id === $runtime->id
            && $this->agent_session_id === $runtime->agent_session_id
            && $this->process_generation === $runtime->process_generation
            && $this->host_id === $runtime->host_id;
    }

    public function holdsAt(CarbonImmutable $now): bool
    {
        return $this->status->isHolding() && $this->expires_at->greaterThan($now);
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<AgentRuntime, $this>
     */
    public function runtime(): BelongsTo
    {
        return $this->belongsTo(AgentRuntime::class, 'agent_runtime_id');
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function ofTake(Builder $query, string $takeId): void
    {
        $query->where('take_id', $takeId);
    }

    /**
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function withGrantId(Builder $query, string $grantId): void
    {
        $query->where('grant_id', $grantId);
    }

    /**
     * The grant a host request takes or releases.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function settledBy(Builder $query, string $requestId): void
    {
        $query->where(fn (Builder $either) => $either->where('take_request_id', $requestId)
            ->orWhere('release_request_id', $requestId));
    }

    /**
     * Grants of the runtime that hold or are about to hold its input.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function holdingRuntime(Builder $query, string $runtimeId, CarbonImmutable $now): void
    {
        $query->where('agent_runtime_id', $runtimeId)
            ->whereIn('status', TerminalGrantStatus::holding())
            ->where('expires_at', '>', $now);
    }

    /**
     * The rows of the given agent.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofAgent(Builder $query, string $agentId): void
    {
        $query->where('agent_id', $agentId);
    }

    /**
     * The rows with their runtime's session loaded.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withRuntimeSession(Builder $query): void
    {
        $query->with('runtime.session');
    }
}
