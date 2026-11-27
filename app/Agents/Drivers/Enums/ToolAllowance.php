<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Enums;

/**
 * How a driver is told to run a tool call the journal admitted unchanged: Claude Code takes an allow decision, Codex
 * refuses one without a rewritten input and runs a call no hook decided on under its own rules.
 */
enum ToolAllowance: string
{
    case AllowDecision = 'allow_decision';
    case NoDecision = 'no_decision';

    /**
     * The decision fields of the reply that lets the call run unchanged.
     *
     * @return array<string, DriverPermission>
     */
    public function decisionFields(): array
    {
        return match ($this) {
            self::AllowDecision => ['permissionDecision' => DriverPermission::Allow],
            self::NoDecision => [],
        };
    }
}
