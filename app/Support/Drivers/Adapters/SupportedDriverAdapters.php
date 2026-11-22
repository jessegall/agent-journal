<?php

declare(strict_types=1);

namespace App\Support\Drivers\Adapters;

use App\Contracts\Drivers\DriverCatalogue;
use App\Exceptions\HookProtocolUnknown;
use App\Support\Drivers\Contracts\DriverAdapter;
use App\Support\Drivers\Contracts\DriverAdapters;

/**
 * The adapter of each native hook protocol the journal reads, keyed by the protocol it names.
 */
final readonly class SupportedDriverAdapters implements DriverAdapters
{
    /**
     * @var array<string, DriverAdapter>
     */
    private array $adapters;

    public function __construct(
        ClaudeCodeAdapter $claudeCode,
        CodexAdapter $codex,
        private DriverCatalogue $drivers,
    ) {
        $this->adapters = [$claudeCode->hookProtocol() => $claudeCode, $codex->hookProtocol() => $codex];
    }

    public function for(string $family): DriverAdapter
    {
        $protocol = $this->drivers->registrationOfFamily($family)->hookProtocol;

        return $this->adapters[$protocol] ?? throw HookProtocolUnknown::for($protocol);
    }

    public function supports(string $family): bool
    {
        return $this->drivers->hasFamily($family)
            && array_key_exists($this->drivers->registrationOfFamily($family)->hookProtocol, $this->adapters);
    }
}
