<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Drivers\Enums\HookDriver;
use App\Http\Data\Profiles\EligibleAccountsData;
use App\Operations\Enums\AccessType;
use App\Profiles\Contracts\StartAccounts;
use App\Profiles\Models\Account;
use App\Profiles\Models\ActiveAccount;
use App\Profiles\Models\Profile;
use App\Profiles\Policies\ProfileAdministrationPolicy;

/**
 * The accounts the owner may choose for a start of one driver, read under the authority the start itself needs, so
 * whoever may not start one learns no account label.
 */
final readonly class EligibleAccounts implements StartAccounts
{
    public function __construct(private CurrentAuthorizer $authorizer) {}

    public function forDriver(HookDriver $driver): EligibleAccountsData
    {
        $this->authorizer->authorize(ProfileAdministrationPolicy::class, Profile::class, AccessType::Create);
        $default = ActiveAccount::defaultAccountIdOf($driver);
        $accounts = array_filter(Account::listed(), fn (Account $account) => $account->driver === $driver->value);

        return EligibleAccountsData::from([
            'driver' => $driver->value,
            'accounts' => array_values(array_map(
                fn (Account $account) => EligibleAccountRows::of($account, $account->id === $default),
                $accounts,
            )),
        ]);
    }
}
