<?php

declare(strict_types=1);

namespace App\Accounts\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The accounts the owner may choose for a start of one driver, in the order the Accounts page lists them, and the
 * models the start's profile permits, its default first; none when no profile was named.
 */
#[TypeScript]
final class EligibleAccountsData extends Data
{
    /**
     * @param  list<EligibleAccountData>  $accounts
     */
    public function __construct(
        public readonly string $driver,
        #[DataCollectionOf(EligibleAccountData::class)]
        public readonly array $accounts,
        // The model a start runs when none is chosen: the family's model at the profile's preferred tier.
        public readonly string|null $defaultModel = null,
        // The driver family the profile prefers, which the Start dialog preselects; none when it prefers none.
        public readonly string|null $preferredDriver = null,
    ) {}
}
