<?php

declare(strict_types=1);

namespace App\Hosts\Values;

use App\Api\SignedCall;

/**
 * The host behind the current request, its verified call and the protocol it spoke, bound for this request only;
 * for a connected project's relay also the live binding it serves, which scopes all the work it may touch.
 */
final readonly class HostContext
{
    /**
     * @param  list<string>  $bindingIds  the live binding a local-project host serves, none for an enrolled host
     */
    public function __construct(
        public string $hostId,
        public SignedCall $call,
        public array $bindingIds = [],
    ) {}

    /**
     * The same call, as the relay of this live binding.
     */
    public function servingBinding(string $bindingId): self
    {
        return new self($this->hostId, $this->call, [$bindingId]);
    }
}
