<?php

declare(strict_types=1);

namespace App\Connections\Values;

/**
 * What the journal answers a presence report: the binding, the boot generation it holds, the folder's setup
 * generation it acknowledged, the server's time and when the presence expires, in ISO 8601, and the binding's
 * authority generation its relay renews runtime leases under.
 */
final readonly class PresenceReceipt
{
    public function __construct(
        public string $bindingId,
        public int $generation,
        public int $setupGeneration,
        public string $serverTime,
        public string $expiresAt,
        public int $authorityGeneration,
    ) {}
}
