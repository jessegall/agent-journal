<?php

declare(strict_types=1);

namespace App\Connections\Values;

/**
 * What the journal answers a presence report: the boot generation it holds, when its presence expires, in ISO 8601,
 * by server time, and the binding's authority generation its relay renews runtime leases under.
 */
final readonly class PresenceReceipt
{
    public function __construct(public int $generation, public string $expiresAt, public int $authorityGeneration) {}
}
