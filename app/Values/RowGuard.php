<?php

declare(strict_types=1);

namespace App\Values;

use App\Hosts\Protocol\Data\HostRowGuardData;

/**
 * The screen rows a key write is meant for, named by the SHA-256 of their text joined by newlines.
 */
final readonly class RowGuard
{
    public function __construct(public int $from, public int $to, public string $hash) {}

    /**
     * The guard as a write_keys order carries it.
     */
    public function guard(): HostRowGuardData
    {
        return HostRowGuardData::from(['from' => $this->from, 'to' => $this->to, 'hash' => $this->hash]);
    }
}
