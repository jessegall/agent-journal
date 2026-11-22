<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Accounts\SignInProtocol;
use App\Enums\SignInMethod;
use App\Exceptions\SignInMethodMissing;
use Illuminate\Contracts\Container\Container;

/**
 * The sign-in protocol of each method each driver declares, registered by its adapter.
 */
final class SignInProtocols
{
    /**
     * @var Registry<class-string<SignInProtocol>>
     */
    private readonly Registry $protocols;

    public function __construct(private readonly Container $container)
    {
        $this->protocols = Registry::replacing(SignInMethodMissing::forKey(...));
    }

    /**
     * @param  class-string<SignInProtocol>  $protocol
     */
    public function register(string $driver, SignInMethod $method, string $protocol): void
    {
        $this->protocols->put(self::keyOf($driver, $method), $protocol);
    }

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
     * Whether the host has a protocol for the driver's method, OAuth when no method is named.
     */
    public function supports(string $driver, SignInMethod $method = SignInMethod::OAuth): bool
    {
        return $this->protocols->has(self::keyOf($driver, $method));
    }

    /**
     * The protocol of the driver's method, OAuth when no method is named.
     *
     * @throws SignInMethodMissing
     */
    public function for(string $driver, SignInMethod $method = SignInMethod::OAuth): SignInProtocol
    {
        return $this->container->make($this->protocols->get(self::keyOf($driver, $method)));
    }

    private static function keyOf(string $driver, SignInMethod $method): string
    {
        return "{$driver}:{$method->value}";
    }
}
