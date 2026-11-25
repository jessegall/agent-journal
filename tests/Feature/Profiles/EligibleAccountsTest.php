<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Sessions\ProfileResolver;
use App\Support\DefaultDrivers;
use App\Support\ProfileProposal;
use App\Support\StartAccounts;
use App\Values\ProfileKey;
use Tests\Support\CommitsHookRows;
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

    public function test_a_profile_that_allows_any_model_offers_its_own_and_every_model_of_the_drivers_family(): void
    {
        $this->chooseActiveAccounts();
        $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand(ProfileProposal::fromConfiguration(
            (array) config('profiles'),
        )));
        $profile = $this->app->make(ProfileResolver::class)->snapshotFor(ProfileKey::from(self::PROFILE));
        $family = $this->app->make(DriverCatalogue::class)->family(DefaultDrivers::CLAUDE_CODE);

        $eligible = $this->app->make(StartAccounts::class)->forProfileStart(DefaultDrivers::CLAUDE_CODE, self::PROFILE);

        $this->assertSame($family->models, $eligible->toArray()['modelChoices']);
        $this->assertSame($family->modelAt($profile->preferredTier), $eligible->toArray()['defaultModel']);
    }
}
