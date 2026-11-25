<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\RenameAccount\RenameAccountCommand;
use App\Commands\Accounts\SwitchAccount\SwitchAccountCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Exceptions\AccountLabelInvalid;
use App\Exceptions\AccountLabelTaken;
use App\Exceptions\AccountNameChanged;
use App\Models\Accounts\Account;
use App\Support\ActorContext;
use App\Support\DefaultDrivers;
use App\Values\AccountLabel;
use App\Values\OwnerAuthority;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * A rename trims the name and refuses one another account holds, and two tabs renaming one account refuse the second
 * until it saves again.
 */
final class RenameAccountTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'accounts',
        'active_accounts',
        'sign_in_attempts',
        'account_notices',
        'command_receipts',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->actAsOwner();
    }

    public function test_a_rename_trims_the_name_and_refuses_one_another_account_holds(): void
    {
        [$work, $home] = [$this->account('Work'), $this->account('Home')];

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
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
