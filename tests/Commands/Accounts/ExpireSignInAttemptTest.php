<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Accounts\Commands\BeginSignIn\BeginSignInCommand;
use App\Accounts\Commands\ExpireSignInAttempt\ExpireSignInAttemptCommand;
use App\Accounts\Enums\CommandEntry;
use App\Accounts\Enums\SignInMethod;
use App\Accounts\Enums\SignInStatus;
use App\Bus\JournalCommands;
use App\Jobs\SignInDeadline;
use App\Models\Accounts\Account;
use App\Models\Accounts\SignInAttempt;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Bus;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * An attempt with no account looks no account up when it expires.
 */
#[TestsCommand(ExpireSignInAttemptCommand::class)]
final class ExpireSignInAttemptTest extends TestCase
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
    }

    public function test_an_attempt_with_no_account_looks_no_account_up_when_it_expires(): void
    {
        $this->journal->actAs('Owner');
        $begin = new BeginSignInCommand('codex', SignInMethod::OAuth);
        $attemptId = $this->journal->run($begin, 'new')->attemptId;
        $attempts = SignInAttempt::query()->withoutGlobalScopes();
        $attempts->whereKey($attemptId)->update(['expires_at' => now()->subMinute()]);
        $accountReads = [];
        $recordAccountReads = function (QueryExecuted $query) use (&$accountReads): void {
            if (str_contains($query->sql, '"accounts"')) {
                $accountReads[] = $query->sql;
            }
        };
        $this->app->make(Dispatcher::class)->listen(QueryExecuted::class, $recordAccountReads);

        $this->asJournal(new ExpireSignInAttemptCommand($attemptId));

        $expired = SignInAttempt::query()->withoutGlobalScopes()->findOrFail($attemptId);

        $this->assertSame(SignInStatus::Expired, $expired->status);
        $this->assertSame([], $accountReads);
    }

    private function asJournal(object $command): void
    {
        $this->app->make(JournalCommands::class)->runAsJournal(CommandEntry::AccountMaintenance, 'test', $command);
    }
}
