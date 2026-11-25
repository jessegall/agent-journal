<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Commands\Accounts\CheckAccount\CheckAccountCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Files\Files;
use App\Enums\Accounts\AccountCheckResult;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Accounts\SignInMethod;
use App\Enums\Drivers\DriverFailure;
use App\Events\Sessions\DriverFailed;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;
use App\Support\ActorContext;
use App\Support\DefaultDrivers;
use App\Support\JournalCommands;
use App\Support\LocalAccountFolders;
use App\Support\PrivateSignInProcesses;
use App\Support\SignInProtocols;
use App\Values\AccountLabel;
use App\Values\ClaimedAccountCheck;
use App\Values\OwnerAuthority;
use Tests\Fixtures\Profiles\FinishingProtocol;
use Tests\Fixtures\Profiles\RecordingSignInHost;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The host's runner reports the program's own certain answer to an account check.
 */
#[TimeLimit(seconds: 4, reason: 'It commits account changes through the bus and empties five tables per test.')]
final class AccountChecksTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'accounts',
        'active_accounts',
        'account_notices',
        'command_receipts',
        'sign_in_attempts',
    ];

    private Account $account;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
        $this->account = Account::create(DefaultDrivers::CODEX, AccountLabel::from('Work'), '/journal/accounts/work');
        ActiveAccount::findLockedFor(DefaultDrivers::CODEX)->select($this->account);
    }

    public function test_the_runner_reports_the_programs_own_certain_answer(): void
    {
        $host = new RecordingSignInHost(null);
        $host->nextCheck = new ClaimedAccountCheck(
            $this->account->id,
            'codex',
            SignInMethod::OAuth,
            sys_get_temp_dir(),
            1,
        );
        $protocols = new SignInProtocols($this->app);
        $protocols->register('codex', SignInMethod::OAuth, FinishingProtocol::class);

        $ran = new PrivateSignInProcesses($host, $protocols, static fn () => null, $this->app->make(Files::class), new LocalAccountFolders($this->app->make(Files::class)))->checkNext();

        $this->assertTrue($ran);
        $this->assertSame([AccountCheckResult::SignedIn], $host->checks);
    }

    private function failWith(DriverFailure $failure, int $generation): void
    {
        event(new DriverFailed('agent', 'session', 'codex', $failure, $this->account->recordIdentity, $generation));
    }

    private function check(int $generation, AccountCheckResult $result): void
    {
        $this->app->make(JournalCommands::class)->runAsJournal(
            CommandEntry::HostControl,
            'test host',
            new CheckAccountCommand('host', $this->account->id, $generation, $result),
        );
    }
}
