<?php

declare(strict_types=1);

namespace App\Connections\Values;

/**
 * What the journal answers a presence report: the boot generation it holds and when its presence expires, in ISO
 * 8601, by server time.
 */
final readonly class PresenceReceipt
{
    public function __construct(public int $generation, public string $expiresAt) {}
}
