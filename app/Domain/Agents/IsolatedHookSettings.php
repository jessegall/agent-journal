<?php

declare(strict_types=1);

namespace App\Domain\Agents;

/**
 * The settings file a launched program reads from its own isolated settings folder: only the journal's hooks and
 * the journal's tool rules, never anything from the user's own configuration (rule 2).
 */
final class IsolatedHookSettings
{
    /**
     * @var array<string, string>
     */
    private array $hookCommands = [];

    /**
     * @var list<string>
     */
    private array $deniedTools = [];

    public function addHook(string $eventName, string $command): void
    {
        $this->hookCommands[$eventName] = $command;
    }

    /**
     * Turns off a tool the journal cannot follow safely in this program, such as a native child with no identity of its own.
     */
    public function denyTool(string $toolName): void
    {
        $this->deniedTools[] = $toolName;
    }

    public function hasHooks(): bool
    {
        return $this->hookCommands !== [];
    }

    public function content(): string
    {
        return (string) json_encode(IsolatedSettingsFile::of($this->hookCommands, $this->deniedTools), JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }
}
