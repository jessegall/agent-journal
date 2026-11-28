<?php

declare(strict_types=1);

namespace App\Models\Sessions;

use App\Accounts\Enums\AccountProcessRole;
use App\Agents\Enums\SessionProcessStatus;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Events\Sessions\SessionProcessCancelled;
use App\Events\Sessions\SessionProcessClaimed;
use App\Events\Sessions\SessionProcessOutputAdvanced;
use App\Events\Sessions\SessionProcessRegistered;
use App\Events\Sessions\SessionProcessSeenRunning;
use App\Events\Sessions\SessionProcessStopped;
use App\Events\Sessions\StartRefused;
use App\Models\Agents\AgentSession;
use App\Models\Hosts\HostProcess;
use App\Models\Projects\Host;
use App\Models\Support\Accessor;
use App\Models\Support\JournalModel;
use App\Models\Support\SessionProcessScope;
use App\Records\Contracts\ReadableModel;
use App\Sessions\Enums\SessionStatus;
use App\Sessions\Enums\TransportProfileType;
use App\Sessions\Exceptions\SessionProcessUnknown;
use App\Support\RecordIdentity;
use App\Values\SelectedAccount;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Support\Str;

/**
 * @property string $id
 * @property string $agent_id
 * @property string $session_id
 * @property string|null $host_id
 * @property string $start_key
 * @property string $account_type
 * @property string $account_id
 * @property int $account_generation
 * @property string $directory
 * @property SessionProcessStatus $status
 * @property TransportProfileType $transport_profile
 * @property AccountProcessRole $role
 * @property string|null $owner_start_id
 * @property string|null $execution_id
 * @property int $output_generation
 * @property CarbonImmutable|null $ended_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property string|null $refusal
 * @property-read RecordIdentity $account_identity
 * @property-read mixed $settings_identity
 *
 * @mixin \Eloquent
 */
final class SessionProcess extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use Linkable;
    use OrdersById;
    use RaisesEvents;

    /**
     * @var list<string>
     */
    protected $hidden = [
        'directory',
        'start_key',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => SessionProcessStatus::class,
            'transport_profile' => TransportProfileType::class,
            'role' => AccountProcessRole::class,
            'account_generation' => 'integer',
            'output_generation' => 'integer',
            'ended_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

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
        $start->status = SessionProcessStatus::Pending;
        $start->transport_profile = $transport;
        $start->role = AccountProcessRole::Execution;
        $start->save();
        $start->raise(new SessionProcessRegistered($start->id, $start->session_id));

        return $start;
    }

    // ----------[ Mutations ]----------

    /**
     * Starts the next mapping of the session's outputs: grants of an earlier mapping no longer count.
     */
    public function advanceOutputGeneration(): void
    {
        $this->output_generation++;
        $this->save();
        $this->raise(new SessionProcessOutputAdvanced($this->id, $this->output_generation));
    }

    /**
     * The host made the start's process and reports its execution identity, answering whether that moved the start to
     * running; reporting it again, or after the start ended, changes nothing.
     */
    public function recordRunning(string $executionId): bool
    {
        if ($this->status !== SessionProcessStatus::Starting) {
            return false;
        }

        $this->status = SessionProcessStatus::Running;
        $this->execution_id = $executionId;
        $this->save();
        $this->raise(new SessionProcessSeenRunning($this->id, $executionId));

        return true;
    }

    /**
     * The host proved the start's process exited, or that none was made; reporting it again changes nothing.
     */
    public function stopWithProof(): bool
    {
        if (! in_array($this->status, SessionProcessStatus::unresolved(), true)) {
            return false;
        }

        $this->status = SessionProcessStatus::Stopped;
        $this->ended_at = CarbonImmutable::now();
        $this->save();
        $this->raise(new SessionProcessStopped($this->id));

        return true;
    }

    /**
     * The host takes the start to make its process, and answers whether it may: a start no longer pending, cancelled
     * by maintenance or taken already, is never taken again.
     */
    public function claim(): bool
    {
        if ($this->status !== SessionProcessStatus::Pending) {
            return false;
        }

        $this->status = SessionProcessStatus::Starting;
        $this->save();
        $this->raise(new SessionProcessClaimed($this->id));

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
        $this->status = SessionProcessStatus::Stopped;
        $this->ended_at = CarbonImmutable::now();
        $this->refusal = $refusal;
        $this->saveAndAssert();
        $this->raise(new StartRefused($this->agent_id, $this->session_id, $refusal, $this->ended_at, $this->id));
    }

    /**
     * Whether the host refused the start for good.
     */
    public function isRefused(): bool
    {
        return $this->refusal !== null;
    }

    /**
     * The start ends stopped because its session ended before it did.
     */
    public function endWithSession(CarbonImmutable $time): void
    {
        $this->status = SessionProcessStatus::Stopped;
        $this->ended_at = $time;
        $this->saveAndAssert();
        $this->raise(new SessionProcessStopped($this->id));
    }

    /**
     * A pending start that will never run ends cancelled now.
     */
    public function cancelPending(): void
    {
        $this->status = SessionProcessStatus::Cancelled;
        $this->ended_at = CarbonImmutable::now();
        $this->save();
        $this->raise(new SessionProcessCancelled($this->id));
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<RecordIdentity, never>
     */
    protected function accountIdentity(): Attribute
    {
        return Accessor::get(fn () => new RecordIdentity($this->account_type, $this->account_id));
    }

    /**
     * The settings store the start's driver keeps its conversations in: its account's folder, named by identity.
     *
     * @return Attribute<non-falsy-string, never>
     */
    protected function settingsIdentity(): Attribute
    {
        return Accessor::get(fn () => $this->account_type.':'.$this->account_id);
    }

    // ----------[ Queries ]----------

    public function isStarting(): bool
    {
        return $this->status === SessionProcessStatus::Starting;
    }

    /**
     * The start by its id, locked, as a host process that runs for it names it, whoever's agent it belongs to.
     */
    public static function findLockedById(string $id): self
    {
        return self::query()->supervised()->whereKey($id)->lockForUpdate()->sole();
    }

    /**
     * The unresolved starts on the host with the start's account and sign-in generation, locked.
     *
     * @return list<self>
     */
    public static function findLockedOnAccountOf(self $start, string $hostId): array
    {
        return array_values(self::query()
            ->supervised()
            ->unresolved()
            ->onAccountGenerationOf($start)
            ->onHost($hostId)
            ->lockForUpdate()
            ->get()
            ->all());
    }

    /**
     * The session's start that may still run, locked: the newest one not cancelled or stopped; none for a session
     * the journal does not supervise.
     */
    public static function findLockedCurrentOf(string $sessionId): self|null
    {
        return self::query()->supervised()
            ->unresolved()
            ->ofSessions([$sessionId])
            ->newestFirst()
            ->lockForUpdate()
            ->first();
    }

    /**
     * The session's starts no host has taken yet, locked, so a cancelled start ends them before any process opens.
     *
     * @return list<self>
     */
    public static function findLockedPendingOf(string $sessionId): array
    {
        return array_values(self::query()->supervised()
            ->ofSessions([$sessionId])
            ->pending()
            ->lockForUpdate()
            ->get()
            ->all());
    }

    /**
     * The session's start that may still run, for reading what it granted; none when no start runs.
     */
    public static function findCurrentOf(string $sessionId): self|null
    {
        return self::query()->supervised()->unresolved()->ofSessions([$sessionId])->newestFirst()->first();
    }

    /**
     * The session's latest start, for telling which account and generation a failure it reports belongs to.
     */
    public static function findLatestOfSession(string $sessionId): self|null
    {
        return self::query()->supervised()->ofSessions([$sessionId])->newestFirst()->first();
    }

    /**
     * The transport the session's latest supervised start runs on: how its agent reaches the journal's tools. A
     * session the journal does not supervise runs on MCP, as every start does unless its account chose the CLI.
     */
    public static function resolveTransportOfSession(string $sessionId): TransportProfileType
    {
        $start = self::findLatestOfSession($sessionId);

        if ($start === null) {
            return TransportProfileType::Mcp;
        }

        return $start->transport_profile;
    }

    /**
     * The id of each of these sessions' latest supervised start, by session; a session the journal does not supervise
     * is not in it. A host's claim binds its report to it.
     *
     * @param  list<string>  $ids
     * @return array<string, string>
     */
    public static function resolveLatestIdsOfSessions(array $ids): array
    {
        return self::query()->supervised()
            ->ofSessions($ids)
            ->newestOfItsSession()
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
    public static function resolveRefusalsOf(array $agentIds): array
    {
        $latest = self::query()->supervised()
            ->ofAgents($agentIds)
            ->newestOfItsAgent()
            ->get();

        return $latest->filter(fn (self $start) => $start->refusal !== null)->mapWithKeys(
            fn (self $start) => [$start->agent_id => (string) $start->refusal],
        )->all();
    }

    /**
     * The start the host claimed, by its key, locked; another host's start is as unknown as a missing one.
     *
     * @throws SessionProcessUnknown
     */
    public static function findClaimedBy(string $hostId, string $startKey): self
    {
        return self::query()->supervised()
            ->onHost($hostId)
            ->underStartKey($startKey)
            ->lockForUpdate()->firstOr(SessionProcessUnknown::throwing()->for($startKey));
    }

    /**
     * The keys of the host's starts that may still have a process, for its restart reconciliation.
     *
     * @return list<string>
     */
    public static function resolveUnresolvedKeysOf(string $hostId): array
    {
        $keys = self::query()->supervised()
            ->onHost($hostId)
            ->unresolved()
            ->oldestFirst()
            ->pluck('start_key');

        return array_values(array_map(strval(...), $keys->all()));
    }

    /**
     * How many starts on the account may still have or make a process, for the account-use read.
     */
    public static function countUnresolvedOf(RecordIdentity $account): int
    {
        return self::query()->supervised()->onAccount($account)->unresolved()->count();
    }

    /**
     * @param  list<RecordIdentity>  $accounts
     * @return array<string, int>
     */
    public static function resolveUnresolvedCountsByAccount(array $accounts): array
    {
        if ($accounts === []) {
            return [];
        }

        $counts = self::query()
            ->supervised()
            ->unresolved()
            ->onAccounts($accounts)
            ->unresolvedCounts()
            ->limit(count($accounts))
            ->get();

        $running = [];

        foreach ($counts as $count) {
            $running["{$count->account_type}:{$count->account_id}"] = (int) $count->getAttribute('running_count');
        }

        return $running;
    }

    /**
     * The sessions of the starts on the account that may still have or make a process, oldest first.
     *
     * @return list<string>
     */
    public static function resolveUnresolvedSessionIdsOf(RecordIdentity $account): array
    {
        $sessionIds = self::query()->supervised()
            ->onAccount($account)
            ->unresolved()
            ->oldestFirst()
            ->pluck('session_id');

        return array_values(array_unique(array_map(strval(...), $sessionIds->all())));
    }

    /**
     * The sessions of the host's starts that may still have a process, the only sessions whose stop attempts it runs.
     *
     * @return list<string>
     */
    public static function resolveUnresolvedSessionIdsOn(string $hostId): array
    {
        $sessionIds = self::query()->supervised()
            ->onHost($hostId)
            ->unresolved()
            ->oldestFirst()
            ->pluck('session_id');

        return array_values(array_unique(array_map(strval(...), $sessionIds->all())));
    }

    /**
     * The session's supervised starts still holding account use.
     *
     * @return list<self>
     */
    public static function findUnresolvedOfSession(string $sessionId): array
    {
        return array_values(self::query()->supervised()->ofSessions([$sessionId])->unresolved()->get()->all());
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
     * The starts on the same account and sign-in generation as the start.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function onAccountGenerationOf(Builder $query, self $start): void
    {
        $query->where('account_type', $start->account_type)
            ->where('account_id', $start->account_id)
            ->where('account_generation', $start->account_generation);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unresolved(Builder $query): void
    {
        $states = array_map(fn (SessionProcessStatus $status) => $status->value, SessionProcessStatus::unresolved());
        $query->whereIn('status', $states);
    }

    /**
     * The starts of the sessions.
     *
     * @param  Builder<self>  $query
     * @param  list<string>  $ids
     */
    #[Scope]
    protected function ofSessions(Builder $query, array $ids): void
    {
        $query->whereIn('session_id', $ids);
    }

    /**
     * The starts of the agents.
     *
     * @param  Builder<self>  $query
     * @param  list<string>  $ids
     */
    #[Scope]
    protected function ofAgents(Builder $query, array $ids): void
    {
        $query->whereIn('agent_id', $ids);
    }

    /**
     * The starts no newer start of the same session follows.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function newestOfItsSession(Builder $query): void
    {
        $query->whereNotExists(fn (QueryBuilder $newer) => $newer->from('session_processes', 'newer')
            ->whereColumn('newer.session_id', 'session_processes.session_id')
            ->where(fn (QueryBuilder $later) => $later
                ->whereColumn('newer.created_at', '>', 'session_processes.created_at')
                ->orWhere(fn (QueryBuilder $sameTime) => $sameTime
                    ->whereColumn('newer.created_at', 'session_processes.created_at')
                    ->whereColumn('newer.id', '>', 'session_processes.id'))));
    }

    /**
     * The starts no newer start of the same agent follows.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function newestOfItsAgent(Builder $query): void
    {
        $query->whereNotExists(fn (QueryBuilder $newer) => $newer->from('session_processes', 'newer')
            ->whereColumn('newer.agent_id', 'session_processes.agent_id')
            ->where(fn (QueryBuilder $later) => $later
                ->whereColumn('newer.created_at', '>', 'session_processes.created_at')
                ->orWhere(fn (QueryBuilder $sameTime) => $sameTime
                    ->whereColumn('newer.created_at', 'session_processes.created_at')
                    ->whereColumn('newer.id', '>', 'session_processes.id'))));
    }

    /**
     * The starts on the host.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function onHost(Builder $query, string $hostId): void
    {
        $query->where('host_id', $hostId);
    }

    /**
     * The start of that start key.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function underStartKey(Builder $query, string $startKey): void
    {
        $query->where('start_key', $startKey);
    }

    /**
     * The named read of the supervisor and the account-use read, across every agent's starts.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function supervised(Builder $query): void
    {
        $query->withoutGlobalScope(SessionProcessScope::class);
    }

    /**
     * The starts no host claimed yet.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function pending(Builder $query): void
    {
        $query->where('status', SessionProcessStatus::Pending->value);
    }

    /**
     * The starts under any of these keys.
     *
     * @param  Builder<self>  $query
     * @param  list<string>  $keys
     */
    #[Scope]
    protected function withStartKeys(Builder $query, array $keys): void
    {
        $query->whereIn('start_key', $keys);
    }

    /**
     * The starts the journal claimed whose host never took up a process: every process ordered for them is still only
     * ordered and their session never beat. A start on a reachable host is untaken by the cutoff; one on an unreachable
     * host waits out the host wait first.
     *
     * @param  Builder<self>  $query
     * @param  Builder<Host>  $unreachableHosts
     */
    #[Scope]
    protected function untakenSince(
        Builder $query,
        CarbonImmutable $hostWaitEnd,
        CarbonImmutable $cutoff,
        Builder $unreachableHosts,
    ): void {
        $query->where('status', SessionProcessStatus::Starting->value)
            ->where(fn ($starts) => $starts
                ->where('created_at', '<=', $hostWaitEnd)
                ->orWhere(fn ($reachable) => $reachable
                    ->where('created_at', '<=', $cutoff)
                    ->whereNotIn('host_id', $unreachableHosts)))
            ->whereNotIn('id', HostProcess::query()->takenUp()->startIds())
            ->whereIn('session_id', AgentSession::query()
                ->withAnyStatus(SessionStatus::running())
                ->neverBeat()
                ->keys());
    }

    /**
     * The pending starts left unclaimed too long: made before the host wait ended, or before the cutoff where a
     * reachable host could have claimed them, of a running session that never beat.
     *
     * @param  Builder<self>  $query
     * @param  Builder<Host>  $unreachableHosts
     */
    #[Scope]
    protected function unclaimedTooLong(
        Builder $query,
        CarbonImmutable $hostWaitEnd,
        CarbonImmutable $cutoff,
        Builder $unreachableHosts,
        bool $isAnyHostReachable,
    ): void {
        $query->where('status', SessionProcessStatus::Pending->value)
            ->where(fn ($starts) => $starts
                ->where('created_at', '<=', $hostWaitEnd)
                ->orWhere(fn ($reachable) => $reachable
                    ->where('created_at', '<=', $cutoff)
                    ->where(fn ($hosted) => $isAnyHostReachable
                        ? $hosted->whereNull('host_id')->orWhereNotIn('host_id', $unreachableHosts)
                        : $hosted->whereNotIn('host_id', $unreachableHosts))))
            ->whereIn('session_id', AgentSession::query()
                ->withAnyStatus(SessionStatus::running())
                ->neverBeat()
                ->keys());
    }

    /**
     * Only the id of each start, as a subquery.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ids(Builder $query): void
    {
        $query->select('id');
    }

    /**
     * Only the session of each start, as a subquery.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function sessionIds(Builder $query): void
    {
        $query->select('session_id');
    }

    /**
     * @param  Builder<self>  $query
     * @param  list<RecordIdentity>  $accounts
     */
    #[Scope]
    protected function onAccounts(Builder $query, array $accounts): void
    {
        $groups = RecordIdentity::groupedByType($accounts);
        $query->where(static function (Builder $owners) use ($groups): void {
            foreach ($groups as $type => $records) {
                $owners->orWhere(static fn (Builder $pair) => $pair
                    ->where('account_type', $type)
                    ->whereIn('account_id', array_column($records, 'id')));
            }
        });
    }

    /** @param  Builder<self>  $query */
    #[Scope]
    protected function unresolvedCounts(Builder $query): void
    {
        $query->select(['account_type', 'account_id'])
            ->selectRaw('count(*) as running_count')
            ->groupBy('account_type', 'account_id');
    }
}
