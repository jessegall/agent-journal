<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Support\ActorContext;
use App\Agents\Enums\StartUnavailableReason;
use App\Drivers\Enums\HookDriver;
use App\Profiles\Enums\AccountCheckResult;
use App\Profiles\Models\Account;
use App\Profiles\Support\EligibleAccounts;
use App\Profiles\Values\AccountLabel;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestStartAuthority;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * The owner sees, per driver, the accounts a start may use: label, whether each can start and why not, the sign-in
 * revision to review and the default; never a folder, identity or secret, and nobody else sees any.
 */
final class EligibleAccountsTest extends TestCase
{
    use CommitsHookRows;
    use WithActiveAccount;

    private const array TABLES = ['accounts', 'active_accounts', 'account_notices'];

    private const array SECRET_FIELDS = ['directory', 'identity', 'subject', 'workspace', 'fingerprint'];

    public function test_the_owner_sees_each_codex_account_with_its_state_revision_and_default_and_no_secret(): void
    {
        $default = $this->chooseActiveAccounts()['codex'];
        $signedOut = Account::create(HookDriver::Codex, AccountLabel::from('Signed out'), '/journal/accounts/out');
        $signedOut->applyCheck($signedOut->sign_in_generation, AccountCheckResult::SignedOut, CarbonImmutable::now());

        $eligible = $this->app->make(EligibleAccounts::class)->forDriver(HookDriver::Codex)->toArray();
        $rows = array_column($eligible['accounts'], null, 'id');

        $this->assertSame([$signedOut->id, $default->id], array_keys($rows));
        $this->assertSame(['Signed out', null, false], [
            $rows[$signedOut->id]['label'],
            null,
            $rows[$signedOut->id]['isDefault'],
        ]);
        $this->assertSame(StartUnavailableReason::NeedsSignIn->value, $rows[$signedOut->id]['unavailableReason']);
        $this->assertSame([null, true, $default->sign_in_generation], [
            $rows[$default->id]['unavailableReason'],
            $rows[$default->id]['isDefault'],
            $rows[$default->id]['signInRevision'],
        ]);
        $this->assertSame([], array_intersect(self::SECRET_FIELDS, array_keys($rows[$default->id])));
    }

    public function test_an_agent_is_refused_and_learns_no_label(): void
    {
        $this->chooseActiveAccounts();
        $agentId = (string) Str::ulid();
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($agentId),
            TestStartAuthority::forAgent($agentId),
        );

        $this->expectException(ActorNotAllowed::class);

        $this->app->make(EligibleAccounts::class)->forDriver(HookDriver::Codex);
    }
}
