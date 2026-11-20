<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Profiles\Contracts\SignInProtocol;
use App\Profiles\Exceptions\SignInProtocolMissing;
use App\Registries\Support\Registry;
use Illuminate\Contracts\Container\Container;

/**
 * The sign-in protocol of each program the host can sign in, registered by its adapter.
 */
final class SignInProtocols
{
    /**
     * @var Registry<class-string<SignInProtocol>>
     */
    private readonly Registry $protocols;

    public function __construct(private readonly Container $container)
    {
        $this->protocols = Registry::replacing(SignInProtocolMissing::for(...));
    }

    /**
     * @param  class-string<SignInProtocol>  $protocol
     */
    public function register(string $program, string $protocol): void
    {
        $this->protocols->put($program, $protocol);
    }

    /**
     * Whether the host has a sign-in protocol for the program.
     */
    public function supports(string $program): bool
    {
        return $this->protocols->has($program);
    }

    /**
     * @throws SignInProtocolMissing
     */
    public function for(string $program): SignInProtocol
    {
        return $this->container->make($this->protocols->get($program));
    }
}
