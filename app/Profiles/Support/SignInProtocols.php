<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Profiles\Contracts\SignInProtocol;
use App\Profiles\Enums\SignInMethod;
use App\Profiles\Exceptions\SignInMethodMissing;
use App\Registries\Support\Registry;
use Illuminate\Contracts\Container\Container;

/**
 * The sign-in protocol of each method each program declares, registered by its adapter.
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
    public function register(string $program, SignInMethod $method, string $protocol): void
    {
        $this->protocols->put(self::keyOf($program, $method), $protocol);
    }

    /**
     * The methods the program declares, in the order the sign-in form lists them, OAuth first.
     *
     * @return list<SignInMethod>
     */
    public function methodsOf(string $program): array
    {
        return array_values(array_filter(
            SignInMethod::cases(),
            fn (SignInMethod $method) => $this->supports($program, $method),
        ));
    }

    /**
     * Whether the host has a protocol for the program's method, OAuth when no method is named.
     */
    public function supports(string $program, SignInMethod $method = SignInMethod::OAuth): bool
    {
        return $this->protocols->has(self::keyOf($program, $method));
    }

    /**
     * The protocol of the program's method, OAuth when no method is named.
     *
     * @throws SignInMethodMissing
     */
    public function for(string $program, SignInMethod $method = SignInMethod::OAuth): SignInProtocol
    {
        return $this->container->make($this->protocols->get(self::keyOf($program, $method)));
    }

    private static function keyOf(string $program, SignInMethod $method): string
    {
        return "{$program}:{$method->value}";
    }
}
