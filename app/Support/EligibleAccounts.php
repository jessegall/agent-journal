<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Accounts\StartAccounts;
use App\Contracts\Authorization\CurrentAuthorizer;
use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Sessions\ProfileResolver;
use App\Data\Profiles\EligibleAccountsData;
use App\Enums\AccessType;
use App\Models\Account;
use App\Models\ActiveAccount;
use App\Models\Profile;
use App\Policies\ProfileAdministrationPolicy;
use App\Values\ProfileKey;
use App\Values\ProfileSnapshot;

/**
 * The accounts the owner may choose for a start of one driver, read under the authority the start itself needs, so
 * whoever may not start one learns no account label.
 */
final readonly class EligibleAccounts implements StartAccounts
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

        return EligibleAccountsData::from([
            'driver' => $accounts->driver,
            'accounts' => $accounts->accounts,
            'modelChoices' => $this->modelChoices($driver, $profile),
        ]);
    }

    /**
     * The models a start may choose: the profile's own and those it allows, or, when it allows any, the profile's
     * own and every model the driver's family runs.
     *
     * @return list<string>
     */
    private function modelChoices(string $driver, ProfileSnapshot $profile): array
    {
        $allowed = $profile->start->allowedModels;
        $offered = $allowed === [] ? $this->drivers->family($driver)->models : $allowed;

        return array_values(array_unique([$profile->model, ...$offered]));
    }

    public function forDriver(string $driver): EligibleAccountsData
    {
        $this->authorizer->authorize(ProfileAdministrationPolicy::class, Profile::class, AccessType::Create);
        $default = ActiveAccount::defaultAccountIdOf($driver);
        $accounts = array_filter(Account::listed(), fn (Account $account) => $account->account_protocol === $driver);

        return EligibleAccountsData::from([
            'driver' => $driver,
            'accounts' => array_values(array_map(
                fn (Account $account) => EligibleAccountFactory::of($account, $account->id === $default),
                $accounts,
            )),
        ]);
    }
}
