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
use App\Drivers\Values\DriverFamily;
use App\Drivers\Values\DriverKey;
use App\Drivers\Values\DriverRegistration;
use App\Drivers\Values\ProviderKey;

/**
 * The four drivers every journal ships: Claude Code and Codex, each in a terminal and headless (doc 103, section 3).
 */
final readonly class DefaultDrivers
{
    public const int PROTOCOL_VERSION = 1;

    public const string CLAUDE_CODE = 'claude-code';

    public const string CODEX = 'codex';

    /**
     * The keys of the default families, for a place that names each default driver family without the catalogue.
     *
     * @return list<string>
     */
    public static function familyKeys(): array
    {
        return [self::CLAUDE_CODE, self::CODEX];
    }

    /**
     * @return list<DriverFamily>
     */
    public static function families(): array
    {
        return [
            new DriverFamily(self::CLAUDE_CODE, 'Claude Code', ProviderKey::from('anthropic'), 'claude', true),
            // Codex scopes its hooks per installation, not per thread, so a connected folder cannot run it isolated yet.
            new DriverFamily(self::CODEX, 'Codex', ProviderKey::from('openai'), 'codex', false),
        ];
    }

    /**
     * @return list<DriverRegistration>
     */
    public static function registrations(): array
    {
        return [
            self::registration('claude-code', self::CLAUDE_CODE, DriverVariant::Terminal, 'Claude Code', TerminalCapabilities::class),
            self::registration('claude-code-headless', self::CLAUDE_CODE, DriverVariant::Headless, 'Claude Code headless', HeadlessCapabilities::class),
            self::registration('codex', self::CODEX, DriverVariant::Terminal, 'Codex', CodexTerminalCapabilities::class),
            self::registration('codex-headless', self::CODEX, DriverVariant::Headless, 'Codex headless', CodexHeadlessCapabilities::class),
        ];
    }

    /**
     * @param  class-string<DriverCapabilities>  $capabilities
     */
    private static function registration(
        string $key,
        string $family,
        DriverVariant $mode,
        string $label,
        string $capabilities,
    ): DriverRegistration {
        return new DriverRegistration(
            DriverKey::from($key),
            $family,
            $mode,
            $label,
            self::PROTOCOL_VERSION,
            [],
            $family,
            $family,
            $family,
            $capabilities,
            [DriverCapability::Run, DriverCapability::HookMethods],
        );
    }
}
