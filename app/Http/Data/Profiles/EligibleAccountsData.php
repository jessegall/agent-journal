<?php

declare(strict_types=1);

namespace App\Http\Data\Profiles;

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
     * @param  list<string>  $modelChoices
     */
    public function __construct(
        public readonly string $driver,
        #[DataCollectionOf(EligibleAccountData::class)]
        public readonly array $accounts,
        public readonly array $modelChoices = [],
    ) {}
}
