<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\BeginSignInAgain\BeginSignInAgainCommand;
use App\Commands\Accounts\ReconcileAccounts\ReconcileAccountsCommand;
use App\Enums\Accounts\AccountProcessRole;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Agents\SessionProcessStatus;
use App\Jobs\SignInDeadline;
use App\Models\Accounts\Account;
use App\Models\Accounts\SignInAttempt;
use App\Support\JournalCommands;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A sign-in again waits for the account's uses and is released to the host only once every process on the account
 * ended.
 */
#[TimeLimit(seconds: 4, reason: 'It commits accounts, attempts and starts through the bus and empties seven tables.')]
final class ReleaseSignInAgainTest extends TestCase
{
    use CommitsHookRows;
    use WithActiveAccount;

    private const array TABLES = [
        'users',
        'accounts',
        'active_accounts',
        'sign_in_attempts',
        'command_receipts',
        'links',
        'session_processes',
        'account_notices',
    ];

    private Account $account;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();

        Bus::fake([SignInDeadline::class]);
        $this->account = $this->chooseActiveAccounts()['codex'];
        $this->account->forceFill(['subject' => 'subject-1'])->save();
    }

    public function test_the_host_takes_it_only_after_the_accounts_processes_ended(): void
    {
        $this->startProcessOnAccount();
        $attemptId = $this->again('tab-1');

        $this->assertNull($this->claimSignIn('host', CarbonImmutable::now()));
        $this->reconcile();
        $this->assertNull($this->claimSignIn('host', CarbonImmutable::now()));

        DB::table('session_processes')->update(['status' => SessionProcessStatus::Stopped->value]);
        $this->reconcile();

        $this->assertSame($attemptId, $this->claimSignIn('host', CarbonImmutable::now())?->id);
    }

    private function again(string $requestKey): string
    {
        $this->journal->actAs('Owner');

        return $this->journal->run(new BeginSignInAgainCommand($this->account->id), $requestKey)
            ->attemptId;
    }

    private function reconcile(): void
    {
        $this->app->make(JournalCommands::class)
            ->runAsJournal(CommandEntry::AccountMaintenance, 'account reconciliation', new ReconcileAccountsCommand());
    }

    private function startProcessOnAccount(): void
    {
        DB::table('session_processes')->insert([
            'id' => strtolower((string) Str::ulid()),
            'agent_id' => strtolower((string) Str::ulid()),
            'session_id' => strtolower((string) Str::ulid()),
            'start_key' => (string) Str::ulid(),
            'account_type' => Account::linkType(),
            'account_id' => $this->account->id,
            'account_generation' => $this->account->sign_in_generation,
            'directory' => (string) $this->account->directory,
            'status' => SessionProcessStatus::Running->value,
            'role' => AccountProcessRole::Execution->value,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    private function claimSignIn(string $hostId, CarbonImmutable $now): SignInAttempt|null
    {
        $attempt = SignInAttempt::findOldestWaitingAt($now);
        $attempt?->claimOn($hostId);

        return $attempt;
    }
}
