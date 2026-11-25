<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\RenameAccount\RenameAccountCommand;
use App\Commands\Accounts\SwitchAccount\SwitchAccountCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Events\Accounts\AccountsChanged;
use App\Exceptions\AccountMissing;
use App\Exceptions\AccountSelectionChanged;
use App\Exceptions\AccountUnavailable;
use App\Exceptions\ActorNotAllowed;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;
use App\Support\ActorReference;
use App\Support\DefaultDrivers;
use App\Values\AccountLabel;
use App\Values\OwnerAuthority;
use Illuminate\Support\Facades\Event;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

/**
 * The owner chooses a program's account: switching commits in order and a repeated click changes nothing, a choice
 * against an older selection is refused, a refused choice leaves the other program's default alone, an account that
 * must sign in again or is removed cannot be chosen, and an agent can neither switch nor rename.
 */
#[TestsCommand(SwitchAccountCommand::class)]
final class SwitchAccountTest extends TestCase
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

    public function test_switching_commits_in_order_and_a_repeated_click_changes_nothing(): void
    {
        Event::fake([AccountsChanged::class]);
        [$work, $home] = [$this->account('Work'), $this->account('Home')];

        $this->bus()->run(new SwitchAccountCommand($work->id));
        $this->bus()->run(new SwitchAccountCommand($home->id));
        $this->bus()->run(new SwitchAccountCommand($home->id));

        $selection = ActiveAccount::query()->sole();
        $this->assertSame([$home->id, 2], [$selection->account_id, $selection->change_number]);
        $this->assertSame(1, $home->refresh()->sign_in_generation);
        Event::assertDispatchedTimes(AccountsChanged::class, 2);
    }

    public function test_a_choice_made_against_an_older_selection_is_refused_and_leaves_the_newer_one(): void
    {
        [$work, $home] = [$this->account('Work'), $this->account('Home')];
        $this->bus()->run(new SwitchAccountCommand($work->id, 0));

        $this->assertRefused(AccountSelectionChanged::class, new SwitchAccountCommand($home->id, 0));

        $selection = ActiveAccount::query()->sole();
        $this->assertSame([$work->id, 1], [$selection->account_id, $selection->change_number]);
        $this->bus()->run(new SwitchAccountCommand($home->id, 1));
        $this->assertSame($home->id, $selection->refresh()->account_id);
    }

    public function test_a_refused_choice_leaves_the_other_programs_default_alone(): void
    {
        [$work, $home] = [$this->account('Work'), $this->account('Home')];
        $codex = Account::create(DefaultDrivers::CODEX, AccountLabel::from('Codex'), '/journal/accounts/Codex');
        $this->bus()->run(new SwitchAccountCommand($codex->id, 0));
        $this->bus()->run(new SwitchAccountCommand($work->id, 0));

        $this->assertRefused(AccountSelectionChanged::class, new SwitchAccountCommand($home->id, 0));

        $chosen = ActiveAccount::query()->withoutGlobalScopes()->pluck('account_id', 'account_protocol')->all();
        $this->assertSame(['claude-code' => $work->id, 'codex' => $codex->id], $chosen);
    }

    public function test_an_account_that_must_sign_in_again_or_is_removed_cannot_be_chosen(): void
    {
        $held = $this->account('Held');
        $held->beginRemoval();

        $this->assertRefused(AccountUnavailable::class, new SwitchAccountCommand($held->id));

        $held->finishRemoval();
        $this->assertRefused(AccountMissing::class, new SwitchAccountCommand($held->id));
        $this->assertRefused(AccountMissing::class, new RenameAccountCommand($held->id, 'Other'));
    }

    public function test_an_agent_can_neither_switch_nor_rename(): void
    {
        $work = $this->account('Work');
        $this->app->make(CurrentActorSetter::class)->set(
            ActorReference::forAgent(TestIds::of(9)),
            TestStartAuthority::forAgent(TestIds::of(9)),
        );

        $this->assertRefused(ActorNotAllowed::class, new SwitchAccountCommand($work->id));
        $this->assertRefused(ActorNotAllowed::class, new RenameAccountCommand($work->id, 'Mine'));
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
