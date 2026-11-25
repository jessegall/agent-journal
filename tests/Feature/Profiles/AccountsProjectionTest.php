<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Commands\Accounts\RenameAccount\RenameAccountCommand;
use App\Commands\Accounts\SwitchAccount\SwitchAccountCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Events\Accounts\AccountsChanged;
use App\Models\Accounts\Account;
use App\Support\ActorContext;
use App\Support\DefaultDrivers;
use App\Values\AccountLabel;
use App\Values\OwnerAuthority;
use Illuminate\Events\Dispatcher;
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

    // A failure is never swallowed, so the failing notice command is thrown, named by its fact.
    private function account(string $label): Account
    {
        return Account::create(DefaultDrivers::CLAUDE_CODE, AccountLabel::from($label), '/journal/accounts/'.$label);
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
