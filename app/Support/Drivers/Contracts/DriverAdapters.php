<?php

declare(strict_types=1);

namespace App\Support\Drivers\Contracts;

/**
 * The adapter that reads and answers the hook calls of each native hook protocol, by the protocol's key.
 */
interface DriverAdapters
{
    public function for(string $hookProtocol): DriverAdapter;

    public function supports(string $hookProtocol): bool;
}
