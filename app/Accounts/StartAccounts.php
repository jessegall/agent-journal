<?php

declare(strict_types=1);

namespace App\Accounts;

use App\Access\Contracts\CurrentAuthorizer;
use App\Accounts\Contracts\StartAccounts as StartAccountsContract;
use App\Accounts\Data\EligibleAccountsData;
use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Enums\AccessType;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;
use App\Models\Profiles\Profile;
use App\Policies\ProfileAdministrationPolicy;
use App\Sessions\Contracts\ProfileResolver;
use App\Values\ProfileKey;

/**
 * The accounts the owner may choose for a start of one driver, read under the authority the start itself needs, so
 * whoever may not start one learns no account label.
 */
final readonly class StartAccounts implements StartAccountsContract
{
    public function __construct(
        private CurrentAuthorizer $authorizer,
        private ProfileResolver $profiles,
        private DriverCatalogue $drivers,
    ) {}

    public function forProfileStart(string $driver, string $profileKey): EligibleAccountsData
    {
        $accounts = $this->forDriver($driver);
        $profile = $this->profiles->snapshotFor(ProfileKey::from($profileKey));
        $family = $this->drivers->family($driver);

        return EligibleAccountsData::from([
            'driver' => $accounts->driver,
            'accounts' => $accounts->accounts,
            'modelChoices' => $family->models,
            'defaultModel' => $family->modelAt($profile->preferredTier),
            'preferredDriver' => $profile->start->preferredDriver,
        ]);
    }

    public function forDriver(string $driver): EligibleAccountsData
    {
        $this->authorizer->authorize(ProfileAdministrationPolicy::class, Profile::class, AccessType::Create);
        $default = ActiveAccount::resolveDefaultAccountIdOf($driver);
        $accounts = array_filter(Account::findListed(), fn (Account $account) => $account->account_protocol === $driver);

        return EligibleAccountsData::from([
            'driver' => $driver,
            'accounts' => array_values(array_map(
                fn (Account $account) => EligibleAccountFactory::of($account, $account->id === $default),
                $accounts,
            )),
        ]);
    }
}
