<?php

declare(strict_types=1);

namespace App\Support\Drivers;

use App\Contracts\DriverSkills;
use App\Exceptions\DriverSkillsUnsupported;
use App\Values\DriverKey;

/**
 * The skill adapter of each driver the journal can hand skills to.
 */
final readonly class DriverSkillAdapters
{
    /**
     * @var array<string, DriverSkills>
     */
    private array $adapters;

    public function __construct(ClaudeCodeSkills $claudeCode, CodexSkills $codex)
    {
        $this->adapters = [$claudeCode->skillProtocol() => $claudeCode, $codex->skillProtocol() => $codex];
    }

    /**
     * @throws DriverSkillsUnsupported for a skill protocol no adapter writes
     */
    public function for(DriverKey $protocol): DriverSkills
    {
        return $this->adapters[$protocol->key] ?? throw DriverSkillsUnsupported::for($protocol);
    }

    public function supports(DriverKey $protocol): bool
    {
        return array_key_exists($protocol->key, $this->adapters);
    }
}
