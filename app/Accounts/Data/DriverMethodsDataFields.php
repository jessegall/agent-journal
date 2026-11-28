<?php

declare(strict_types=1);

namespace App\Accounts\Data;

use App\Accounts\Enums\SignInMethod;
use App\Accounts\SignInProtocols;
use App\Web\Creation\Exceptions\MissingFields;

final class DriverMethodsDataFields
{
    private string $driver;

    /** @var list<SignInMethodData> */
    private array $methods;

    public function driver(string $driver): self
    {
        $this->driver = $driver;

        return $this;
    }

    /** @param list<SignInMethodData> $methods */
    public function methods(array $methods): self
    {
        $this->methods = $methods;

        return $this;
    }

    public function protocols(SignInProtocols $protocols): self
    {
        if (! isset($this->driver)) {
            throw MissingFields::forType(DriverMethodsData::class, 'driver');
        }

        $driver = $this->driver;

        return $this->methods(array_map(
            static fn (SignInMethod $method) => SignInMethodData::fromProtocol($method, $protocols->for($driver, $method)),
            $protocols->methodsOf($driver),
        ));
    }

    public function finish(): DriverMethodsData
    {
        if (! isset($this->driver)) {
            throw MissingFields::forType(DriverMethodsData::class, 'driver');
        }

        if (! isset($this->methods)) {
            throw MissingFields::forType(DriverMethodsData::class, 'methods');
        }

        return new DriverMethodsData(
            driver: $this->driver,
            methods: $this->methods,
        );
    }
}
