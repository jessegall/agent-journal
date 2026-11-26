<?php

declare(strict_types=1);

namespace App\Sessions;

/**
 * The settings file a started driver reads from its own isolated settings folder: only the journal's hooks and
 * the journal's tool rules, allowed and denied, never anything from the user's own configuration.
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

    /**
     * @var list<string>
     */
    private array $allowedTools = [];

    public function addHook(string $eventName, string $command): void
    {
        $this->hookCommands[$eventName] = $command;
    }

    /**
     * Turns off a tool the journal cannot follow safely in this driver, such as a native child with no identity of its
     * own.
     */
    public function denyTool(string $toolName): void
    {
        $this->deniedTools[] = $toolName;
    }

    /**
     * Lets the driver call a tool without a native prompt, such as the journal's own MCP tools.
     */
    public function allowTool(string $rule): void
    {
        $this->allowedTools[] = $rule;
    }

    public function hasHooks(): bool
    {
        return $this->hookCommands !== [];
    }

    public function content(): string
    {
        return (string) json_encode(
            IsolatedSettingsFile::of($this->hookCommands, $this->allowedTools, $this->deniedTools),
            JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES,
        );
    }
}
