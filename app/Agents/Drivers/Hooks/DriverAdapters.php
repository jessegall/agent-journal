<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Hooks;

use App\Agents\Drivers\Setup\DriverProfiles;
use App\Contracts\Drivers\DriverAdapter;
use App\Contracts\Drivers\DriverAdapters as DriverAdaptersContract;
use App\Contracts\Drivers\DriverCatalogue;
use App\Exceptions\HookProtocolUnknown;

/**
 * The adapter of each native hook protocol the journal reads, keyed by the protocol it names.
 */
final readonly class DriverAdapters implements DriverAdaptersContract
{
    /**
     * @var array<string, DriverAdapter>
     */
    private array $adapters;

    public function __construct(DriverProfiles $profiles, private DriverCatalogue $drivers)
    {
        $adapters = [];

        foreach ($profiles->all() as $profile) {
            $adapter = $profile->hookAdapter();
            $adapters[$adapter->hookProtocol()] = $adapter;
        }

        $this->adapters = $adapters;
    }

    public function for(string $family): DriverAdapter
    {
        $protocol = $this->drivers->registrationOfFamily($family)->hookProtocol;

        return $this->adapters[$protocol] ?? throw HookProtocolUnknown::for($protocol);
    }

    public function all(): array
    {
        return array_values($this->adapters);
    }

    public function supports(string $family): bool
    {
        return $this->drivers->hasFamily($family)
            && array_key_exists($this->drivers->registrationOfFamily($family)->hookProtocol, $this->adapters);
    }
}
