<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\BeginSignIn\BeginSignInCommand;
use App\Commands\Accounts\ExpireSignInAttempt\ExpireSignInAttemptCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Accounts\SignInMethod;
use App\Enums\Accounts\SignInStatus;
use App\Jobs\SignInDeadline;
use App\Models\Access\User;
use App\Models\Accounts\Account;
use App\Models\Accounts\SignInAttempt;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Support\JournalCommands;
use App\Values\OwnerAuthority;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Bus;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsKeyedCommands;
use Tests\Support\TestIds;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * An attempt with no account looks no account up when it expires.
 */
final class ExpireSignInAttemptTest extends TestCase
{
    use CommitsHookRows;
    use RunsKeyedCommands;
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

        User::factory()->create(['id' => TestIds::of(1)]);
        $this->app->instance(AccessSettings::class, new AccessSettings(TestIds::of(1)));
        Bus::fake([SignInDeadline::class]);
        $this->account = $this->chooseActiveAccounts()['codex'];
    }

    public function test_an_attempt_with_no_account_looks_no_account_up_when_it_expires(): void
    {
        $this->actAsOwner();
        $begin = new BeginSignInCommand('codex', SignInMethod::OAuth);
        $attemptId = $this->runOnBus($begin, 'new')->attemptId;
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

    private function actAsOwner(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
    }
}
