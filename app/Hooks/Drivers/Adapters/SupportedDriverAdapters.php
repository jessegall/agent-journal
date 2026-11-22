<?php

declare(strict_types=1);

namespace App\Hooks\Drivers\Adapters;

use App\Hooks\Drivers\Contracts\DriverAdapter;
use App\Hooks\Drivers\Contracts\DriverAdapters;
use App\Hooks\Exceptions\HookProtocolUnknown;

/**
 * The adapter of each native hook protocol the journal reads, keyed by the protocol it names.
 */
final readonly class SupportedDriverAdapters implements DriverAdapters
{
    /**
     * @var array<string, DriverAdapter>
     */
    private array $adapters;

    public function __construct(ClaudeCodeAdapter $claudeCode, CodexAdapter $codex)
    {
        $this->adapters = [$claudeCode->hookProtocol() => $claudeCode, $codex->hookProtocol() => $codex];
    }

    public function for(string $hookProtocol): DriverAdapter
    {
        return $this->adapters[$hookProtocol] ?? throw HookProtocolUnknown::for($hookProtocol);
    }
}
