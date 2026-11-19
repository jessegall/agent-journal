<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Agents\Enums\AccountProcessRole;
use App\Agents\Enums\ProcessStartState;
use App\Agents\Exceptions\ProcessStartUnknown;
use App\Agents\Models\Support\ProcessStartScope;
use App\Agents\Support\SelectedAccount;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Records\Support\RecordIdentity;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * One process start of a launch on an account, registered in the launch's transaction before any process exists: the
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
 * @property AccountProcessRole $role
 * @property string|null $owner_start_id
 * @property string|null $execution_id
 * @property int $output_generation
 * @property CarbonImmutable|null $ended_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['execution_id'])]
final class ProcessStart extends Model implements ReadableModel
{
    use BoundedReads, HasUlids;

    /**
     * @var list<string>
     */
    protected $hidden = ['directory', 'start_key'];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'state' => ProcessStartState::class,
            'role' => AccountProcessRole::class,
            'account_generation' => 'integer',
            'output_generation' => 'integer',
            'ended_at' => 'immutable_datetime',
        ];
    }

    /**
     * A new start of the session's launch on the selected account, waiting for its host.
     */
    public static function register(AgentSession $session, SelectedAccount $account): self
    {
        $start = new self();
        $start->agent_id = $session->agent_id;
        $start->session_id = $session->id;
        $start->start_key = (string) Str::ulid();
        $start->account_type = $account->record->type;
        $start->account_id = $account->record->id;
        $start->account_generation = $account->generation;
        $start->directory = $account->directory;
        $start->state = ProcessStartState::Pending;
        $start->role = AccountProcessRole::Execution;
        $start->save();

        return $start;
    }

    /**
     * The pending start of the session, taken by the host that will make its process; none when it was cancelled or
     * taken already. A start whose session ended is cancelled instead, so no process starts for it.
     */
    public static function claimFor(string $hostId, string $sessionId): self|null
    {
        $start = self::supervised()
            ->where('session_id', $sessionId)
            ->where('state', ProcessStartState::Pending->value)
            ->lockForUpdate()
            ->first();

        if ($start === null) {
            return null;
        }

        if (! AgentSession::query()->findOrFail($sessionId)->isActive()) {
            $start->state = ProcessStartState::Cancelled;
            $start->ended_at = CarbonImmutable::now();
            $start->save();

            return null;
        }

        $start->host_id = $hostId;
        $start->claim();

        return $start;
    }

    /**
     * The session's start that may still run, locked: the newest one not cancelled or stopped; none for a session
     * the journal does not supervise.
     */
    public static function lockedCurrentOf(string $sessionId): self|null
    {
        return self::supervised()->unresolved()->where('session_id', $sessionId)->orderByDesc('created_at')->lockForUpdate()
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
     * Starts the next mapping of the session's outputs: grants of an earlier mapping no longer count.
     */
    public function advanceOutputGeneration(): void
    {
        $this->output_generation++;
        $this->save();
    }

    /**
     * The settings store the start's program keeps its conversations in: its account's folder, named by identity.
     */
    public function settingsIdentity(): string
    {
        return $this->account_type.':'.$this->account_id;
    }

    /**
     * The session's latest start, for telling which account and generation a failure it reports belongs to.
     */
    public static function latestOfSession(string $sessionId): self|null
    {
        return self::supervised()->where('session_id', $sessionId)->orderByDesc('created_at')->first();
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
     * The host made the start's process and reports its execution identity; reporting it again changes nothing.
     */
    public function recordRunning(string $executionId): void
    {
        if ($this->state !== ProcessStartState::Starting) {
            return;
        }

        $this->state = ProcessStartState::Running;
        $this->execution_id = $executionId;
        $this->save();
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

    public function accountIdentity(): RecordIdentity
    {
        return new RecordIdentity($this->account_type, $this->account_id);
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
     * Cancels the account's starts that no host has claimed yet, so they never make a process, and answers how many.
     */
    public static function cancelPendingOf(RecordIdentity $account): int
    {
        return self::supervised()
            ->onAccount($account)
            ->where('state', ProcessStartState::Pending->value)
            ->update(['state' => ProcessStartState::Cancelled->value, 'ended_at' => CarbonImmutable::now()]);
    }

    /**
     * Cancels the agent's starts no host has claimed yet, as its retirement does; a claimed start stays until its host
     * proves the process gone, since retiring the agent proves no exit.
     *
     * @return list<RecordIdentity>
     */
    public static function cancelPendingOfAgent(string $agentId): array
    {
        $starts = self::supervised()
            ->where('agent_id', $agentId)
            ->where('state', ProcessStartState::Pending->value)
            ->lockForUpdate()
            ->readAll('a retiring agent has few starts')
            ->get();
        $accounts = [];

        foreach ($starts as $start) {
            $start->state = ProcessStartState::Cancelled;
            $start->ended_at = CarbonImmutable::now();
            $start->save();
            $account = $start->accountIdentity();
            $accounts["{$account->type} {$account->id}"] = $account;
        }

        return array_values($accounts);
    }

    /**
     * Ends the named starts whose host proved their process exited, and answers the accounts they used.
     *
     * @param  list<string>  $startKeys
     * @return list<RecordIdentity>
     */
    public static function stopProven(string $hostId, array $startKeys): array
    {
        $starts = self::supervised()
            ->where('host_id', $hostId)
            ->whereIn('start_key', $startKeys)
            ->unresolved()
            ->lockForUpdate()
            ->readAll('a host reports a bounded batch of exited starts')
            ->get();
        $accounts = [];

        foreach ($starts as $start) {
            $start->stopWithProof();
            $account = $start->accountIdentity();
            $accounts["{$account->type} {$account->id}"] = $account;
        }

        return array_values($accounts);
    }

    /**
     * The named read of the supervisor and the account-use read, across every agent's starts.
     *
     * @return Builder<self>
     */
    private static function supervised(): Builder
    {
        return self::query()->withoutGlobalScope(ProcessStartScope::class);
    }

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
