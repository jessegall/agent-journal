<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Drivers\DriverCapabilities;
use App\Enums\DriverCapability;
use App\Enums\DriverVariant;
use App\Support\Capabilities\CodexHeadlessCapabilities;
use App\Support\Capabilities\CodexTerminalCapabilities;
use App\Support\Capabilities\HeadlessCapabilities;
use App\Support\Capabilities\TerminalCapabilities;
use App\Values\DriverFamily;
use App\Values\DriverKey;
use App\Values\DriverRegistration;
use App\Values\ProviderKey;

/**
 * The four drivers every journal ships: Claude Code and Codex, each in a terminal and headless (doc 103, section 3).
 */
final readonly class DefaultDrivers
{
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
            new DriverFamily(
                self::CLAUDE_CODE,
                'Claude Code',
                ProviderKey::from('anthropic'),
                'claude',
                true,
                ['haiku', 'sonnet', 'opus', 'fable'],
            ),

            // Codex scopes its hooks per installation, not per thread, so a connected folder cannot run it isolated
            // yet.
            new DriverFamily(
                self::CODEX,
                'Codex',
                ProviderKey::from('openai'),
                'codex',
                false,
                ['gpt-6-luna', 'gpt-6.1-terra', 'gpt-6.2-sol', 'gpt-6.2-astra'],
            ),
        ];
    }

    /**
     * @return list<DriverRegistration>
     */
    public static function registrations(): array
    {
        return [
            self::registration(
                'claude-code',
                self::CLAUDE_CODE,
                DriverVariant::Terminal,
                'Claude Code',
                TerminalCapabilities::class,
            ),
            self::registration(
                'claude-code-headless',
                self::CLAUDE_CODE,
                DriverVariant::Headless,
                'Claude Code headless',
                HeadlessCapabilities::class,
            ),
            self::registration(
                'codex',
                self::CODEX,
                DriverVariant::Terminal,
                'Codex',
                CodexTerminalCapabilities::class,
            ),
            self::registration(
                'codex-headless',
                self::CODEX,
                DriverVariant::Headless,
                'Codex headless',
                CodexHeadlessCapabilities::class,
            ),
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
            [],
            $family,
            $family,
            $family,
            $capabilities,
            [DriverCapability::Run, DriverCapability::HookMethods],
        );
    }
}
