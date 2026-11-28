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
use App\Profiles\Enums\ModelTier;
use App\Sessions\Contracts\ProfileResolver;
use App\Values\ProfileBase;
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

        return $this->withProfileDefaults($accounts, ProfileKey::from($profileKey));
    }

    public function forBuiltInStart(string $driver, ProfileBase $base): EligibleAccountsData
    {
        $accounts = $this->forDriver($driver);
        $key = ProfileKey::from($base->key);

        return $this->profiles->has($key)
            ? $this->withProfileDefaults($accounts, $key)
            : $this->withStartDefaults($accounts, $base->tier, null);
    }

    public function forDriver(string $driver): EligibleAccountsData
    {
        $this->authorizer->authorize(ProfileAdministrationPolicy::class, Profile::class, AccessType::Create);
        $default = ActiveAccount::resolveDefaultAccountIdOf($driver);

        $accounts = array_filter(
            Account::findListed(),
            fn (Account $account) => $account->account_protocol === $driver,
        );

        return EligibleAccountsData::from([
            'driver' => $driver,
            'accounts' => array_values(array_map(
                fn (Account $account) => EligibleAccountFactory::of($account, $account->id === $default),
                $accounts,
            )),
        ]);
    }

    public function familiesWithAccounts(): array
    {
        $families = array_map(fn (Account $account) => $account->account_protocol, Account::findListed());

        return array_values(array_unique($families));
    }

    public function hasSignedInAccount(): bool
    {
        return Account::hasSignedInAccount();
    }

    private function withProfileDefaults(EligibleAccountsData $accounts, ProfileKey $key): EligibleAccountsData
    {
        $profile = $this->profiles->snapshotFor($key);

        return $this->withStartDefaults($accounts, $profile->preferredTier, $profile->start->preferredDriver);
    }

    private function withStartDefaults(
        EligibleAccountsData $accounts,
        ModelTier $tier,
        string|null $preferredDriver,
    ): EligibleAccountsData {
        return EligibleAccountsData::from([
            'driver' => $accounts->driver,
            'accounts' => $accounts->accounts,
            'defaultModel' => $this->drivers->family($accounts->driver)->modelAt($tier),
            'preferredDriver' => $preferredDriver,
        ]);
    }
}
