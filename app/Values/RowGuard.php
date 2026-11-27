<?php

declare(strict_types=1);

namespace App\Values;

use App\Hosts\Protocol\Payloads\HostRowGuardPayload;

/**
 * The screen rows a key write is meant for, named by the SHA-256 of their text joined by newlines.
 */
final readonly class RowGuard
{
    public function __construct(public int $from, public int $to, public string $hash) {}

    /**
     * The guard as a write_keys instruction carries it.
     */
    public function payload(): HostRowGuardPayload
    {
        return HostRowGuardPayload::from(['from' => $this->from, 'to' => $this->to, 'hash' => $this->hash]);
    }
}
