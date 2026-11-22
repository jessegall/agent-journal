<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Contracts\Accounts\ActiveAccountReader;
use App\Contracts\Actors\CurrentActorSetter;
use App\Enums\StartUnavailableReason;
use App\Exceptions\AccountUnavailable;
use App\Models\Account;
use App\Models\ActiveAccount;
use App\Support\ActorContext;
use App\Support\DefaultDrivers;
use App\Values\AccountLabel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestStartAuthority;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A start on an account the owner chose locks that account at the sign-in the owner reviewed, and leaves the saved
 * default alone, so the next automatic start runs with the default again.
 */
final class ChosenAccountStartTest extends TestCase
{
    use CommitsHookRows;
    use WithActiveAccount;

    private const array TABLES = ['accounts', 'active_accounts'];

    public function test_a_start_on_the_chosen_account_runs_with_it_and_the_next_automatic_start_with_the_default(): void
    {
        $default = $this->chooseActiveAccounts()['codex'];
        $chosen = Account::create(DefaultDrivers::CODEX, AccountLabel::from('Second account'), '/journal/accounts/second');

        $explicit = DB::transaction(fn () => $this->accounts()->chosenForStart(
            DefaultDrivers::CODEX,
            $chosen->id,
            $chosen->sign_in_generation,
        ));
        $automatic = DB::transaction(fn () => $this->accounts()->forStart(DefaultDrivers::CODEX));

        $this->assertSame([$chosen->id, $default->id], [$explicit->record->id, $automatic->record->id]);
        $this->assertSame($default->id, ActiveAccount::lockedFor(DefaultDrivers::CODEX)->account_id);
    }

    public function test_a_chosen_account_whose_sign_in_changed_is_refused_for_review(): void
    {
        $chosen = $this->chooseActiveAccounts()['codex'];

        $this->assertRefusedWith(
            StartUnavailableReason::ChosenAccountChanged,
            fn () => $this->accounts()->chosenForStart(DefaultDrivers::CODEX, $chosen->id, $chosen->sign_in_generation + 1),
        );
    }

    public function test_an_unknown_account_another_drivers_account_or_an_agent_acting_gets_the_same_refusal(): void
    {
        $accounts = $this->chooseActiveAccounts();
        $codex = $accounts['codex'];
        $claude = $accounts['claude-code'];

        $this->assertRefusedWith(
            StartUnavailableReason::ChosenAccountMissing,
            fn () => $this->accounts()->chosenForStart(DefaultDrivers::CODEX, (string) Str::ulid(), 0),
        );
        $this->assertRefusedWith(
            StartUnavailableReason::ChosenAccountMissing,
            fn () => $this->accounts()->chosenForStart(DefaultDrivers::CODEX, $claude->id, $claude->sign_in_generation),
        );

        $agentId = (string) Str::ulid();
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($agentId),
            TestStartAuthority::forAgent($agentId),
        );
        $this->assertRefusedWith(
            StartUnavailableReason::ChosenAccountMissing,
            fn () => $this->accounts()->chosenForStart(DefaultDrivers::CODEX, $codex->id, $codex->sign_in_generation),
        );
    }

    private function assertRefusedWith(StartUnavailableReason $reason, callable $start): void
    {
        try {
            DB::transaction($start);
            $this->fail('The chosen account was given to the start.');
        } catch (AccountUnavailable $refused) {
            $this->assertSame($reason, $refused->reason);
        }
    }

    private function accounts(): ActiveAccountReader
    {
        return $this->app->make(ActiveAccountReader::class);
    }
}
