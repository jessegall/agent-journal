<?php

declare(strict_types=1);

namespace App\Accounts;

use App\Accounts\Contracts\SignInProtocol;
use App\Accounts\Enums\SignInMethod;
use App\Accounts\Exceptions\SignInMethodMissing;
use App\Agents\Drivers\Setup\DriverProfiles;
use App\Agents\Drivers\Setup\SignInDriver;
use Illuminate\Contracts\Container\Container;

/**
 * The sign-in protocol of each method each driver declares, registered by its adapter.
 */
final readonly class SignInProtocols
{
    public function __construct(private Container $container, private DriverProfiles $profiles) {}

    /**
     * The methods the driver declares, in the order the sign-in form lists them, OAuth first.
     *
     * @return list<SignInMethod>
     */
    public function methodsOf(string $driver): array
    {
        return array_values(array_filter(
            SignInMethod::cases(),
            fn (SignInMethod $method) => $this->supports($driver, $method),
        ));
    }

    /**
     * Whether the driver's setup has a protocol for the method, OAuth when no method is named.
     */
    public function supports(string $driver, SignInMethod $method = SignInMethod::OAuth): bool
    {
        return $this->profiles->ofFamily($driver)->signInProtocolBy($method) !== null;
    }

    /**
     * The protocol of the driver's method, OAuth when no method is named.
     *
     * @throws SignInMethodMissing
     */
    public function for(string $driver, SignInMethod $method = SignInMethod::OAuth): SignInProtocol
    {
        $protocol = $this->profiles->ofFamily($driver)->signInProtocolBy($method)
            ?? throw SignInMethodMissing::forKey("{$driver}:{$method->value}");

        return $this->container->make($protocol);
    }

    /**
     * The driver as the sign-in runner runs it.
     */
    public function driverOf(string $driver): SignInDriver
    {
        return $this->profiles->ofFamily($driver)->signInDriver();
    }
}
