<?php

declare(strict_types=1);

namespace App\Drivers\Support;

use App\Agents\Enums\DriverVariant;
use App\Drivers\Capabilities\CodexHeadlessCapabilities;
use App\Drivers\Capabilities\CodexTerminalCapabilities;
use App\Drivers\Capabilities\HeadlessCapabilities;
use App\Drivers\Capabilities\TerminalCapabilities;
use App\Drivers\Contracts\DriverCapabilities;
use App\Drivers\Enums\DriverCapability;
use App\Drivers\Enums\HookDriver;
use App\Drivers\Values\DriverKey;
use App\Drivers\Values\DriverRegistration;

/**
 * The four drivers every journal ships: Claude Code and Codex, each in a terminal and headless (doc 103, section 3).
 */
final readonly class DefaultDrivers
{
    public const int PROTOCOL_VERSION = 1;

    /**
     * @return list<DriverRegistration>
     */
    public static function registrations(): array
    {
        return [
            self::registration('claude-code', HookDriver::ClaudeCode, DriverVariant::Terminal, 'Claude Code', TerminalCapabilities::class),
            self::registration('claude-code-headless', HookDriver::ClaudeCode, DriverVariant::Headless, 'Claude Code headless', HeadlessCapabilities::class),
            self::registration('codex', HookDriver::Codex, DriverVariant::Terminal, 'Codex', CodexTerminalCapabilities::class),
            self::registration('codex-headless', HookDriver::Codex, DriverVariant::Headless, 'Codex headless', CodexHeadlessCapabilities::class),
        ];
    }

    /**
     * @param  class-string<DriverCapabilities>  $capabilities
     */
    private static function registration(
        string $key,
        HookDriver $family,
        DriverVariant $mode,
        string $label,
        string $capabilities,
    ): DriverRegistration {
        return new DriverRegistration(
            DriverKey::from($key),
            $family->value,
            $mode,
            $label,
            self::PROTOCOL_VERSION,
            [],
            $family->value,
            $family->value,
            $family->value,
            $capabilities,
            [DriverCapability::Run, DriverCapability::HookMethods],
        );
    }
}
