<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Exceptions\AccountUnavailable;
use App\Bus\Contracts\CommandBus;
use App\Profiles\Commands\RenameAccount;
use App\Profiles\Commands\SwitchAccount;
use App\Profiles\Events\AccountsChanged;
use App\Profiles\Exceptions\AccountLabelInvalid;
use App\Profiles\Exceptions\AccountLabelTaken;
use App\Profiles\Exceptions\AccountMissing;
use App\Profiles\Models\Account;
use App\Profiles\Models\ActiveAccount;
use App\Profiles\Values\AccountLabel;
use App\Programs\Enums\HookProgram;
use Illuminate\Support\Facades\Event;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\Support\TestLaunchAuthority;
use Tests\TestCase;

/**
 * The owner switches the account a program launches with and renames accounts through the bus: each change commits
 * in order and tells the pages once, a repeated click changes nothing, and an agent can do neither.
 */
final class AccountSwitchingTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['accounts', 'active_accounts', 'sign_in_attempts', 'command_receipts'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->actAsOwner();
    }

    public function test_switching_commits_in_order_and_a_repeated_click_changes_nothing(): void
    {
        Event::fake([AccountsChanged::class]);
        [$work, $home] = [$this->account('Work'), $this->account('Home')];

        $this->bus()->run(new SwitchAccount($work->id));
        $this->bus()->run(new SwitchAccount($home->id));
        $this->bus()->run(new SwitchAccount($home->id));

        $selection = ActiveAccount::query()->sole();
        $this->assertSame([$home->id, 2], [$selection->account_id, $selection->change_number]);
        $this->assertSame(1, $home->refresh()->sign_in_generation);
        Event::assertDispatchedTimes(AccountsChanged::class, 2);
    }

    public function test_an_account_that_must_sign_in_again_or_is_removed_cannot_be_chosen(): void
    {
        $held = $this->account('Held');
        $held->beginRemoval();

        $this->assertRefused(AccountUnavailable::class, new SwitchAccount($held->id));

        $held->finishRemoval();
        $this->assertRefused(AccountMissing::class, new SwitchAccount($held->id));
        $this->assertRefused(AccountMissing::class, new RenameAccount($held->id, 'Other'));
    }

    public function test_a_rename_trims_the_name_and_refuses_one_another_account_holds(): void
    {
        [$work, $home] = [$this->account('Work'), $this->account('Home')];

        $this->bus()->run(new RenameAccount($work->id, '  Office '));

        $this->assertSame('Office', $work->refresh()->label);
        $this->assertRefused(AccountLabelTaken::class, new RenameAccount($home->id, 'OFFICE'));
        $this->assertRefused(AccountLabelInvalid::class, new RenameAccount($home->id, '../etc'));
    }

    public function test_an_agent_can_neither_switch_nor_rename(): void
    {
        $work = $this->account('Work');
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent(TestIds::of(9)),
            TestLaunchAuthority::forAgent(TestIds::of(9)),
        );

        $this->assertRefused(ActorNotAllowed::class, new SwitchAccount($work->id));
        $this->assertRefused(ActorNotAllowed::class, new RenameAccount($work->id, 'Mine'));
    }

    /**
     * @param  class-string<\Throwable>  $refusal
     */
    private function assertRefused(string $refusal, SwitchAccount|RenameAccount $command): void
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
        return Account::signedIn(HookProgram::ClaudeCode, AccountLabel::from($label), '/journal/accounts/'.$label);
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
