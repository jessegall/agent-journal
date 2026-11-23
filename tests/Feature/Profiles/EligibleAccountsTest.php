<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Commands\ActivateProfiles\ActivateProfilesCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Sessions\ProfileResolver;
use App\Enums\AccountCheckResult;
use App\Enums\StartUnavailableReason;
use App\Exceptions\ActorNotAllowed;
use App\Models\Account;
use App\Support\ActorContext;
use App\Support\DefaultDrivers;
use App\Support\EligibleAccounts;
use App\Support\ProfileProposal;
use App\Values\AccountLabel;
use App\Values\ProfileKey;
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

    private const string PROFILE = 'journal-main';

    private const array SECRET_FIELDS = ['directory', 'identity', 'subject', 'workspace', 'fingerprint'];

    public function test_the_owner_sees_each_codex_account_with_its_state_revision_and_default_and_no_secret(): void
    {
        $default = $this->chooseActiveAccounts()['codex'];
        $signedOut = Account::create(DefaultDrivers::CODEX, AccountLabel::from('Signed out'), '/journal/accounts/out');
        $signedOut->applyCheck($signedOut->sign_in_generation, AccountCheckResult::SignedOut, CarbonImmutable::now());

        $eligible = $this->app->make(EligibleAccounts::class)->forDriver(DefaultDrivers::CODEX)->toArray();
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

    public function test_a_profile_that_allows_any_model_offers_its_own_and_every_model_of_the_drivers_family(): void
    {
        $this->chooseActiveAccounts();
        $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand(ProfileProposal::fromConfiguration(
            (array) config('profiles'),
        )));
        $profile = $this->app->make(ProfileResolver::class)->snapshotFor(ProfileKey::from(self::PROFILE));
        $family = $this->app->make(DriverCatalogue::class)->family(DefaultDrivers::CLAUDE_CODE);

        $eligible = $this->app->make(EligibleAccounts::class)->forProfileStart(DefaultDrivers::CLAUDE_CODE, self::PROFILE);

        $this->assertSame([], $profile->start->allowedModels);
        $this->assertNotSame([], $family->models);
        $this->assertSame(
            array_values(array_unique([$profile->model, ...$family->models])),
            $eligible->toArray()['modelChoices'],
        );
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

        $this->app->make(EligibleAccounts::class)->forDriver(DefaultDrivers::CODEX);
    }
}
