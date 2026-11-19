<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Profiles\Contracts\SignInProtocol;
use App\Profiles\Exceptions\SignInProtocolMissing;
use Illuminate\Contracts\Container\Container;

/**
 * The sign-in protocol of each program the host can sign in, registered by its adapter.
 */
final class SignInProtocols
{
    /**
     * @var array<string, class-string<SignInProtocol>>
     */
    private array $protocols = [];

    public function __construct(private readonly Container $container) {}

    /**
     * @param  class-string<SignInProtocol>  $protocol
     */
    public function register(string $program, string $protocol): void
    {
        $this->protocols[$program] = $protocol;
    }

    /**
     * @throws SignInProtocolMissing
     */
    public function for(string $program): SignInProtocol
    {
        if (! isset($this->protocols[$program])) {
            throw SignInProtocolMissing::for($program);
        }

        return $this->container->make($this->protocols[$program]);
    }
}
