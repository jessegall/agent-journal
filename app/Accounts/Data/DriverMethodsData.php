<?php

declare(strict_types=1);

namespace App\Accounts\Data;

use App\Web\Creation\Buildable;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The sign-in methods one driver declares on this host, in the order the form lists them, OAuth first.
 */
#[TypeScript]
final class DriverMethodsData extends Data
{
    /** @use Buildable<DriverMethodsDataFields> */
    use Buildable;

    protected const string FIELDS = DriverMethodsDataFields::class;

    /**
     * @param  list<SignInMethodData>  $methods
     */
    public function __construct(
        public readonly string $driver,
        #[DataCollectionOf(SignInMethodData::class)]
        public readonly array $methods,
    ) {}
}
