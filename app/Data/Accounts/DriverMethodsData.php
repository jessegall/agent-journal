<?php

declare(strict_types=1);

namespace App\Data\Accounts;

use App\Enums\SignInMethod;
use App\Support\SignInProtocols;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The sign-in methods one driver declares on this host, in the order the form lists them, OAuth first.
 */
#[TypeScript]
final class DriverMethodsData extends Data
{
    /**
     * @param  list<SignInMethodData>  $methods
     */
    public function __construct(
        public readonly string $driver,
        #[DataCollectionOf(SignInMethodData::class)]
        public readonly array $methods,
    ) {}

    /**
     * The driver's methods as its registered sign-ins describe them, in the order the form lists them.
     */
    public static function fromProtocols(string $driver, SignInProtocols $protocols): self
    {
        return new self(
            $driver,
            array_map(
                fn (SignInMethod $method) => SignInMethodData::fromProtocol($method, $protocols->for($driver, $method)),
                $protocols->methodsOf($driver),
            ),
        );
    }
}
