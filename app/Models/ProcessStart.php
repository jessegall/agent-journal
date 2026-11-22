<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\AccountProcessRole;
use App\Enums\ProcessStartState;
use App\Enums\TransportProfileType;
use App\Events\StartRefused;
use App\Exceptions\ProcessStartUnknown;
use App\Models\Support\ProcessStartScope;
use App\Support\ReadBuilder;
use App\Support\RecordIdentity;
use App\Values\SelectedAccount;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * One process start of a start on an account, registered in the start's transaction before any process exists: the
 * account by identity and the sign-in generation it started in, the host's unique start key, the process's role and,
 * once known, its execution identity. It outlives the journal session, so maintenance always sees a start that may
 * still run; only a cancellation before any process or a proven exit ends it.
 *
 * @property string $id
 * @property string $agent_id
 * @property string $session_id
 * @property string|null $host_id
 * @property string $start_key
 * @property string $account_type
 * @property string $account_id
 * @property int $account_generation
 * @property string $directory
 * @property ProcessStartState $state
 * @property TransportProfileType $transport_profile
 * @property AccountProcessRole $role
 * @property string|null $owner_start_id
 * @property string|null $execution_id
 * @property int $output_generation
 * @property CarbonImmutable|null $ended_at
 * @property string|null $refusal
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['execution_id'])]
final class ProcessStart extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * @var list<string>
     */
    protected $hidden = ['directory', 'start_key'];

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'state' => ProcessStartState::class,
            'transport_profile' => TransportProfileType::class,
            'role' => AccountProcessRole::class,
            'account_generation' => 'integer',
            'output_generation' => 'integer',
            'ended_at' => 'immutable_datetime',
        ];
    }

    /**
     * A new start of the session's start on the selected account, waiting for its host.
     */
    public static function create(
        AgentSession $session,
        SelectedAccount $account,
        TransportProfileType $transport = TransportProfileType::Mcp,
    ): self {
        $start = new self();
        $start->agent_id = $session->agent_id;
        $start->session_id = $session->id;
        $start->start_key = (string) Str::ulid();
        $start->account_type = $account->record->type;
        $start->account_id = $account->record->id;
        $start->account_generation = $account->generation;
        $start->directory = $account->directory;
        $start->state = ProcessStartState::Pending;
        $start->transport_profile = $transport;
        $start->role = AccountProcessRole::Execution;
        $start->save();

        return $start;
    }

    // ----------[ Queries ]----------

    /**
     * The named read of the supervisor and the account-use read, across every agent's starts.
     *
     * @return ReadBuilder<self>
     */
    public static function supervised(): ReadBuilder
    {
        return self::query()->withoutGlobalScope(ProcessStartScope::class);
    }

    /**
     * The session's start that may still run, locked: the newest one not cancelled or stopped; none for a session
     * the journal does not supervise.
     */
    public static function lockedCurrentOf(string $sessionId): self|null
    {
        return self::supervised()
            ->unresolved()
            ->where('session_id', $sessionId)
            ->orderByDesc('created_at')
            ->lockForUpdate()
            ->first();
    }

    /**
     * The session's start that may still run, for reading what it granted; none when no start runs.
     */
    public static function currentOf(string $sessionId): self|null
    {
        return self::supervised()->unresolved()->where('session_id', $sessionId)->orderByDesc('created_at')->first();
    }

    /**
     * The session's latest start, for telling which account and generation a failure it reports belongs to.
     */
    public static function latestOfSession(string $sessionId): self|null
    {
        return self::supervised()->where('session_id', $sessionId)->orderByDesc('created_at')->first();
    }

    /**
     * The id of each of these sessions' latest supervised start, by session; a session the journal does not supervise
     * is not in it. A host's claim binds its report to it.
     *
     * @param  list<string>  $ids
     * @return array<string, string>
     */
    public static function latestIdsOfSessions(array $ids): array
    {
        return self::supervised()
            ->whereIn('session_id', $ids)
            ->whereNotExists(fn (QueryBuilder $newer) => $newer->from('process_starts', 'newer')
                ->whereColumn('newer.session_id', 'process_starts.session_id')
                ->where(fn (QueryBuilder $later) => $later
                    ->whereColumn('newer.created_at', '>', 'process_starts.created_at')
                    ->orWhere(fn (QueryBuilder $sameTime) => $sameTime
                        ->whereColumn('newer.created_at', 'process_starts.created_at')
                        ->whereColumn('newer.id', '>', 'process_starts.id'))))
            ->readExactly(count($ids))
            ->pluck('id', 'session_id')
            ->all();
    }

    /**
     * Why each of these agents' latest start was refused, by agent; an agent whose latest start was not refused is not
     * in it. Home reads the agents it shows at once, one latest start for each.
     *
     * @param  list<string>  $agentIds
     * @return array<string, string>
     */
    public static function refusalsOf(array $agentIds): array
    {
        $latest = self::supervised()
            ->whereIn('agent_id', $agentIds)
            ->whereNotExists(fn (QueryBuilder $newer) => $newer->from('process_starts', 'newer')
                ->whereColumn('newer.agent_id', 'process_starts.agent_id')
                ->where(fn (QueryBuilder $later) => $later->whereColumn('newer.created_at', '>', 'process_starts.created_at')
                    ->orWhere(fn (QueryBuilder $sameTime) => $sameTime->whereColumn('newer.created_at', 'process_starts.created_at')
                        ->whereColumn('newer.id', '>', 'process_starts.id'))))
            ->readExactly(count($agentIds))
            ->get();

        return $latest->filter(fn (self $start) => $start->refusal !== null)->mapWithKeys(
            fn (self $start) => [$start->agent_id => (string) $start->refusal],
        )->all();
    }

    /**
     * The start the host claimed, by its key, locked; another host's start is as unknown as a missing one.
     *
     * @throws ProcessStartUnknown
     */
    public static function claimedBy(string $hostId, string $startKey): self
    {
        $start = self::supervised()
            ->where('host_id', $hostId)
            ->where('start_key', $startKey)
            ->lockForUpdate()
            ->first();

        if ($start === null) {
            throw ProcessStartUnknown::for($startKey);
        }

        return $start;
    }

    /**
     * The keys of the host's starts that may still have a process, for its restart reconciliation.
     *
     * @return list<string>
     */
    public static function unresolvedKeysOf(string $hostId): array
    {
        $keys = self::supervised()
            ->where('host_id', $hostId)
            ->unresolved()
            ->orderBy('created_at')
            ->readAll('a host reconciles every start it may still run')
            ->pluck('start_key');

        return array_values(array_map(strval(...), $keys->all()));
    }

    /**
     * How many starts on the account may still have or make a process, for the account-use read.
     */
    public static function unresolvedCountOf(RecordIdentity $account): int
    {
        return self::supervised()->onAccount($account)->unresolved()->count();
    }

    /**
     * The sessions of the starts on the account that may still have or make a process, oldest first.
     *
     * @return list<string>
     */
    public static function unresolvedSessionIdsOf(RecordIdentity $account): array
    {
        $sessionIds = self::supervised()
            ->onAccount($account)
            ->unresolved()
            ->orderBy('created_at')
            ->readAll('every start that may still use a held account must end before its sign-in changes')
            ->pluck('session_id');

        return array_values(array_unique(array_map(strval(...), $sessionIds->all())));
    }

    /**
     * The sessions of the host's starts that may still have a process, the only sessions whose stop attempts it runs.
     *
     * @return list<string>
     */
    public static function unresolvedSessionIdsOn(string $hostId): array
    {
        $sessionIds = self::supervised()
            ->where('host_id', $hostId)
            ->unresolved()
            ->orderBy('created_at')
            ->readAll('a host runs the stop conditions of every session it may still run')
            ->pluck('session_id');

        return array_values(array_unique(array_map(strval(...), $sessionIds->all())));
    }

    // ----------[ Mutations ]----------

    /**
     * Starts the next mapping of the session's outputs: grants of an earlier mapping no longer count.
     */
    public function advanceOutputGeneration(): void
    {
        $this->output_generation++;
        $this->save();
    }

    /**
     * The host made the start's process and reports its execution identity, answering whether that moved the start to
     * running; reporting it again, or after the start ended, changes nothing.
     */
    public function recordRunning(string $executionId): bool
    {
        if ($this->state !== ProcessStartState::Starting) {
            return false;
        }

        $this->state = ProcessStartState::Running;
        $this->execution_id = $executionId;
        $this->save();

        return true;
    }

    /**
     * The host proved the start's process exited, or that none was made; reporting it again changes nothing.
     */
    public function stopWithProof(): bool
    {
        if (! in_array($this->state, ProcessStartState::unresolved(), true)) {
            return false;
        }

        $this->state = ProcessStartState::Stopped;
        $this->ended_at = CarbonImmutable::now();
        $this->save();

        return true;
    }

    /**
     * The host takes the start to make its process, and answers whether it may: a start no longer pending, cancelled
     * by maintenance or taken already, is never taken again.
     */
    public function claim(): bool
    {
        if ($this->state !== ProcessStartState::Pending) {
            return false;
        }

        $this->state = ProcessStartState::Starting;
        $this->save();

        return true;
    }

    /**
     * The host takes the start for its own process.
     */
    public function claimOn(string $hostId): bool
    {
        $this->host_id = $hostId;

        return $this->claim();
    }

    /**
     * The host's claim was refused for good: the start ends stopped with the refusal's reason, so the agent shows it
     * instead of Working, and no process is made for it.
     */
    public function refuse(string $refusal): void
    {
        $this->state = ProcessStartState::Stopped;
        $this->ended_at = CarbonImmutable::now();
        $this->refusal = $refusal;
        $this->assertSaved($this->save());
        $this->raise(new StartRefused($this->agent_id, $this->session_id, $refusal, $this->ended_at));
    }

    /**
     * A pending start that will never run ends cancelled now.
     */
    public function cancelPending(): void
    {
        $this->state = ProcessStartState::Cancelled;
        $this->ended_at = CarbonImmutable::now();
        $this->save();
    }

    // ----------[ Answers ]----------

    /**
     * The settings store the start's driver keeps its conversations in: its account's folder, named by identity.
     */
    public function settingsIdentity(): string
    {
        return $this->account_type.':'.$this->account_id;
    }

    public function accountIdentity(): RecordIdentity
    {
        return new RecordIdentity($this->account_type, $this->account_id);
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function onAccount(Builder $query, RecordIdentity $account): void
    {
        $query->where('account_type', $account->type)->where('account_id', $account->id);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unresolved(Builder $query): void
    {
        $states = array_map(fn (ProcessStartState $state) => $state->value, ProcessStartState::unresolved());
        $query->whereIn('state', $states);
    }
}
