<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Agents\Drivers\Contracts\DriverLayout;
use App\Agents\Drivers\Enums\HoldReason;
use App\Navigation\Enums\NavigationKey;
use App\Terminals\Screens\FencedRow;
use App\Terminals\Screens\MarkedRow;
use App\Terminals\Screens\MenuFamily;
use App\Terminals\Screens\OptionList;
use App\Terminals\Screens\ScreenLayout;
use App\Terminals\Screens\Slider;

/**
 * How the pinned build draws its terminal, from resources/recordings/claude-code: the composer is the ❯ row between two
 * rules, empty while the cursor sits after the ❯. Each menu is known by its ❯ options and two keywords and holds the
 * runtime for a user; the effort picker is a slider.
 */
final readonly class ClaudeCodeLayout implements DriverLayout
{
    /**
     * How the highlighted option of a menu is marked: ❯ alone, or ❯ with the ✔ of the entry in use where a list keeps
     * a column for it, as the welcome screen's text styles do.
     */
    private const array HIGHLIGHTS = [
        '❯ ✔ ',
        '❯ ',
    ];

    /**
     * The glyphs the spinner cycles through before the working line, read from the recorded turns.
     */
    private const array SPINNER_GLYPHS = [
        '✻ ',
        '✶ ',
        '✳ ',
        '✢ ',
        '· ',
        '* ',
        '✽ ',
    ];

    /**
     * How long the composer and a menu must hold still: a spinner redraws about every 100 ms, so 300 ms is three
     * missed frames.
     */
    private const int STILL_MS = 300;

    /**
     * The layout of Claude Code's terminal, as its recordings measured it.
     */
    public function __invoke(): ScreenLayout
    {
        $options = new OptionList('menu', self::HIGHLIGHTS);

        $menu = fn (string $name, HoldReason $hold, string ...$keywords) => MenuFamily::of(
            $name,
            $hold,
            $options,
            ...$keywords,
        );

        return new ScreenLayout(
            buffer: 'normal',
            composer: new FencedRow('composer', '❯ '),
            emptyCursorColumn: 2,
            composerStillMs: self::STILL_MS,
            menus: [
                $menu(
                    'bypass-warning',
                    HoldReason::TrustRequired,
                    'bypass permissions',
                    'dangerous commands',
                    'accept all responsibility',
                    'sandboxed',
                ),
                $menu('folder-trust', HoldReason::TrustRequired, 'trust', 'folder', 'safety', 'workspace', 'security'),
                $menu(
                    'login-method',
                    HoldReason::LoginRequired,
                    'select login method',
                    'subscription',
                    'console account',
                    '3rd-party platform',
                ),
                $menu(
                    'api-key',
                    HoldReason::LoginRequired,
                    'custom api key',
                    'anthropic_api_key',
                    'use this api key',
                )->secret(),
                $menu(
                    'theme',
                    HoldReason::OnboardingRequired,
                    'text style',
                    'dark mode',
                    'light mode',
                    'colorblind',
                )->answeredWith(NavigationKey::Enter->bytes()),
                $menu(
                    'terms',
                    HoldReason::OnboardingRequired,
                    'consumer terms',
                    'policies',
                    'help improve',
                    'accept terms',
                ),
                $menu(
                    'usage-limit',
                    HoldReason::UsageLimited,
                    'wait for limit to reset',
                    'spend limit',
                    'hit your',
                    'upgrade',
                ),
                $menu(
                    'resume-conversation',
                    HoldReason::UserInput,
                    'resume this conversation',
                    'inactive',
                    'tokens long',
                    'summary',
                ),
                $menu(
                    'question',
                    HoldReason::UserInput,
                    'type something',
                    'review your answers',
                    'submit answers',
                ),
                $menu(
                    'model-picker',
                    HoldReason::UserInput,
                    'select model',
                    'switch between claude models',
                    'default for new sessions',
                    'effort',
                ),
                MenuFamily::of(
                    'effort-picker',
                    HoldReason::UserInput,
                    new Slider(
                        'slider',
                        '▲'
                    ),
                    'faster',
                    'smarter',
                    'to adjust',
                    'for this session only',
                ),
                $menu(
                    'tool-permission',
                    HoldReason::PermissionRequired,
                    'do you want to',
                    "don't ask again",
                    'what to do differently',
                    'allow all edits',
                    'allow this connection',
                ),
            ],
            others: [
                new MarkedRow('spinner', self::SPINNER_GLYPHS, ['…']),
                new MarkedRow('status', ['  '], ['shift+tab'], 3),
            ],
            isBracketedPaste: true,
        );
    }
}
