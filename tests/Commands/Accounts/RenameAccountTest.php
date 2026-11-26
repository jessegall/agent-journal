<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Agents\Drivers\DefaultDrivers;
use App\Commands\Accounts\RenameAccount\RenameAccountCommand;
use App\Commands\Accounts\SwitchAccount\SwitchAccountCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Events\Accounts\AccountsChanged;
use App\Exceptions\AccountLabelInvalid;
use App\Exceptions\AccountLabelTaken;
use App\Exceptions\AccountNameChanged;
use App\Models\Accounts\Account;
use App\Support\ActorReference;
use App\Values\AccountLabel;
use App\Values\OwnerAuthority;
use Illuminate\Events\Dispatcher;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * A rename trims the name and refuses one another account holds, and two tabs renaming one account refuse the second
 * until it saves again.
 */
#[TestsCommand(RenameAccountCommand::class)]
final class RenameAccountTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'accounts',
        'active_accounts',
        'sign_in_attempts',
        'account_notices',
        'command_receipts',
        'users',
        'account_usage_windows',
    ];

    /**
     * @var list<array{string, string}>
     */
    private array $changes = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->actAsOwner();
    }

    public function test_a_rename_trims_the_name_and_refuses_one_another_account_holds(): void
    {
        [$work, $home] = [
            $this->account('Work'),
            $this->account('Home'),
        ];

        $this->bus()->run(new RenameAccountCommand($work->id, '  Office '));

        $this->assertSame('Office', $work->refresh()->label);
        $this->assertRefused(AccountLabelTaken::class, new RenameAccountCommand($home->id, 'OFFICE'));
        $this->assertRefused(AccountLabelInvalid::class, new RenameAccountCommand($home->id, '../etc'));
    }

    public function test_two_tabs_renaming_one_account_refuse_the_second_until_it_saves_again(): void
    {
        $work = $this->account('Work');

        $this->bus()->run(new RenameAccountCommand($work->id, 'Office', 0));
        $this->assertRefused(AccountNameChanged::class, new RenameAccountCommand($work->id, 'Desk', 0));

        $work->refresh();
        $this->assertSame(['Office', 1], [$work->label, $work->name_revision]);
        $this->bus()->run(new RenameAccountCommand($work->id, 'Desk', 1));
        $this->assertSame(['Desk', 2], [$work->refresh()->label, $work->name_revision]);

        $work->forceFill(['checked_at' => now()])->save();
        $this->bus()->run(new RenameAccountCommand($work->id, 'Desk', 2));
        $this->assertSame(2, $work->refresh()->name_revision);
    }

    public function test_renaming_and_switching_each_refresh_the_page_for_the_account(): void
    {
        $this->journal->owner();
        $this->app->make(Dispatcher::class)->listen(AccountsChanged::class, function (AccountsChanged $changed): void {
            $this->changes[] = [
                $changed->driver,
                $changed->accountId,
            ];
        });

        $account = $this->account('Work');

        $this->bus()->run(new RenameAccountCommand($account->id, 'Office'));
        $this->bus()->run(new SwitchAccountCommand($account->id));
        $this->bus()->run(new SwitchAccountCommand($account->id));

        $this->assertSame([[
            'claude-code',
            $account->id,
        ], [
            'claude-code',
            $account->id,
        ]], $this->changes);
    }

    public function test_a_refused_rename_refreshes_nothing(): void
    {
        $this->journal->owner();
        $this->app->make(Dispatcher::class)->listen(AccountsChanged::class, function (AccountsChanged $changed): void {
            $this->changes[] = [
                $changed->driver,
                $changed->accountId,
            ];
        });

        $this->account('Work');
        $home = $this->account('Home');

        $this->assertThrows(fn () => $this->bus()->run(new RenameAccountCommand($home->id, 'Work')));

        $this->assertSame([], $this->changes);
    }

    /**
     * @param  class-string<\Throwable>  $refusal
     */
    private function assertRefused(string $refusal, SwitchAccountCommand|RenameAccountCommand $command): void
    {
        try {
            $this->bus()->run($command);
            $this->fail('The command was not refused.');
        } catch (\Throwable $refused) {
            $this->assertInstanceOf($refusal, $refused);
        }
    }

    private function account(string $label): Account
    {
        return Account::create(DefaultDrivers::CLAUDE_CODE, AccountLabel::from($label), '/journal/accounts/'.$label);
    }

    private function actAsOwner(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorReference::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
