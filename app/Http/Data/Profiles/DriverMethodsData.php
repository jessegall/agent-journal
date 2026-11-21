<?php

declare(strict_types=1);

namespace App\Http\Data\Profiles;

use App\Drivers\Enums\HookDriver;
use App\Profiles\Enums\SignInMethod;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The sign-in methods one program declares on this host, in the order the form lists them, OAuth first.
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
     * @param  list<SignInMethod>  $methods
     */
    public static function fromMethods(HookDriver $driver, array $methods): self
    {
        return new self(
            $driver->value,
            array_map(fn (SignInMethod $method) => SignInMethodData::fromMethod($driver, $method), $methods),
        );
    }
}
