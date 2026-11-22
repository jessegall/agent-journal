<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Commands\RecordAccountNotice\RecordAccountNoticeCommand;
use App\Commands\RenameAccount\RenameAccountCommand;
use App\Commands\SwitchAccount\SwitchAccountCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Bus\JournalCommands;
use App\Enums\AccountNoticeReason;
use App\Enums\CommandEntry;
use App\Enums\DriverFailure;
use App\Events\AccountsChanged;
use App\Events\DriverFailed;
use App\Models\Account;
use App\Models\AccountNotice;
use App\Support\ActorContext;
use App\Support\DefaultDrivers;
use App\Support\EntryDispatchers;
use App\Values\AccountLabel;
use App\Values\OwnerAuthority;
use Illuminate\Events\Dispatcher;
use Psr\Log\LoggerInterface;
use RuntimeException;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * No Profiles handler sends AccountsChanged: the row facts the Accounts page shows reach one projection after the
 * commit, which names the same driver and account, attempt or notice the page refreshed for before; a rolled-back
 * action refreshes nothing, and a notice is recorded through its own command, whose failure is logged.
 */
final class AccountsProjectionTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['accounts', 'active_accounts', 'sign_in_attempts', 'account_notices', 'command_receipts'];

    /**
     * @var list<array{string, string}>
     */
    private array $changes = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
        $this->app->make(Dispatcher::class)->listen(AccountsChanged::class, function (AccountsChanged $changed): void {
            $this->changes[] = [$changed->driver, $changed->accountId];
        });
    }

    public function test_renaming_and_switching_each_refresh_the_page_for_the_account(): void
    {
        $account = $this->account('Work');

        $this->bus()->run(new RenameAccountCommand($account->id, 'Office'));
        $this->bus()->run(new SwitchAccountCommand($account->id));
        $this->bus()->run(new SwitchAccountCommand($account->id));

        $this->assertSame([['claude-code', $account->id], ['claude-code', $account->id]], $this->changes);
    }

    public function test_a_refused_rename_refreshes_nothing(): void
    {
        $this->account('Work');
        $home = $this->account('Home');

        $this->assertThrows(fn () => $this->bus()->run(new RenameAccountCommand($home->id, 'Work')));

        $this->assertSame([], $this->changes);
    }

    public function test_a_program_failure_records_its_notice_through_a_command_and_refreshes_for_the_notice(): void
    {
        $this->app->make(Dispatcher::class)->dispatch(
            new DriverFailed('agent', 'session', 'claude-code', DriverFailure::AuthenticationFailed),
        );

        $notice = AccountNotice::query()->sole();
        $this->assertSame(AccountNoticeReason::SignInRejected, $notice->reason);
        $this->assertSame([['claude-code', $notice->id]], $this->changes);
    }

    public function test_a_failing_notice_command_is_logged_and_reaches_no_caller(): void
    {
        $this->app->bind(JournalCommands::class, fn () => throw new RuntimeException('The notice command failed.'));
        $log = $this->spy(LoggerInterface::class);

        $this->app->make(Dispatcher::class)->dispatch(
            new DriverFailed('agent', 'session', 'claude-code', DriverFailure::AuthenticationFailed),
        );

        $this->assertSame(0, AccountNotice::query()->count());
        $log->shouldHaveReceived('error');
    }

    public function test_recording_the_notice_again_counts_it_and_refreshes_for_the_same_notice(): void
    {
        $record = new RecordAccountNoticeCommand('claude-code', AccountNoticeReason::NeedsSignIn);
        $journal = $this->app->make(EntryDispatchers::class);

        $journal->runAsJournal(CommandEntry::AccountMaintenance, 'test', $record);
        $journal->runAsJournal(CommandEntry::AccountMaintenance, 'test', $record);

        $notice = AccountNotice::query()->sole();
        $this->assertSame(2, $notice->times);
        $this->assertSame([['claude-code', $notice->id], ['claude-code', $notice->id]], $this->changes);
    }

    private function account(string $label): Account
    {
        return Account::create(DefaultDrivers::CLAUDE_CODE, AccountLabel::from($label), '/journal/accounts/'.$label);
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
