<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\RecordAccountNotice\RecordAccountNoticeCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Enums\Accounts\AccountNoticeReason;
use App\Enums\Accounts\CommandEntry;
use App\Events\Accounts\AccountsChanged;
use App\Models\Accounts\AccountNotice;
use App\Support\ActorContext;
use App\Support\JournalCommands;
use App\Values\OwnerAuthority;
use Illuminate\Events\Dispatcher;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Recording a notice again counts it and refreshes the page for the same notice.
 */
final class RecordAccountNoticeTest extends TestCase
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

    // A failure is never swallowed, so the failing notice command is thrown, named by its fact.
    public function test_recording_the_notice_again_counts_it_and_refreshes_for_the_same_notice(): void
    {
        $record = new RecordAccountNoticeCommand('claude-code', AccountNoticeReason::NeedsSignIn);
        $journal = $this->app->make(JournalCommands::class);

        $journal->runAsJournal(CommandEntry::AccountMaintenance, 'test', $record);
        $journal->runAsJournal(CommandEntry::AccountMaintenance, 'test', $record);

        $notice = AccountNotice::query()->sole();
        $this->assertSame(2, $notice->times);
        $this->assertSame([['claude-code', $notice->id], ['claude-code', $notice->id]], $this->changes);
    }
}
