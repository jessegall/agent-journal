<?php

declare(strict_types=1);

namespace App\Agents\Drivers;

use App\Agents\Drivers\Capabilities\CodexHeadlessCapabilities;
use App\Agents\Drivers\Capabilities\CodexTerminalCapabilities;
use App\Agents\Drivers\Capabilities\HeadlessCapabilities;
use App\Agents\Drivers\Capabilities\TerminalCapabilities;
use App\Agents\Drivers\Contracts\DriverCapabilities;
use App\Agents\Drivers\Enums\DriverCapability;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Drivers\Enums\MarkTone;
use App\Agents\Drivers\Enums\SignInCodeDirection;
use App\Agents\Values\ProviderKey;
use App\Values\DriverFamily;
use App\Values\DriverKey;
use App\Values\DriverRegistration;

/**
 * The four drivers every journal ships: Claude Code and Codex, each in a terminal and headless.
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
        return [
            self::CLAUDE_CODE,
            self::CODEX,
        ];
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
                ['claude', 'claude-code-headless'],
                'images/drivers/claude-code.svg',
                MarkTone::Own,
                SignInCodeDirection::PasteBack,
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
                ['codex-headless'],
                'images/drivers/codex.svg',
                MarkTone::CurrentColor,
                SignInCodeDirection::Outgoing,
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
                DriverType::Terminal,
                'Claude Code',
                TerminalCapabilities::class,
                isDrivenByJournal: true,
            ),
            self::registration(
                'claude-code-headless',
                self::CLAUDE_CODE,
                DriverType::Headless,
                'Claude Code headless',
                HeadlessCapabilities::class,
                isDrivenByJournal: true,
            ),
            self::registration(
                'codex',
                self::CODEX,
                DriverType::Terminal,
                'Codex',
                CodexTerminalCapabilities::class,
                isDrivenByJournal: true,
            ),
            self::registration(
                'codex-headless',
                self::CODEX,
                DriverType::Headless,
                'Codex headless',
                CodexHeadlessCapabilities::class,
                isDrivenByJournal: true,
            ),
        ];
    }

    /**
     * @param  class-string<DriverCapabilities>  $capabilities
     */
    private static function registration(
        string $key,
        string $family,
        DriverType $driverType,
        string $label,
        string $capabilities,
        bool $isDrivenByJournal = false,
    ): DriverRegistration {
        return new DriverRegistration(
            DriverKey::from($key),
            $family,
            $driverType,
            $label,
            [],
            $family,
            $family,
            $family,
            $capabilities,
            [DriverCapability::Run, DriverCapability::HookMethods],
            $isDrivenByJournal,
        );
    }
}
