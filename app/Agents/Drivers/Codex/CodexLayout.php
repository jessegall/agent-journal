<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Codex;

use App\Contracts\Drivers\DriverLayout;
use App\Enums\Drivers\HoldReason;
use App\Enums\Navigation\NavigationKey;
use App\Support\Screens\MarkedRow;
use App\Support\Screens\MenuFamily;
use App\Support\Screens\OptionList;
use App\Support\Screens\ScreenLayout;

/**
 * How the pinned build draws its terminal, measured from resources/recordings/codex/0.165.0: the alternate buffer,
 * a composer that is the lowest › row with at most its status lines below it, empty while the cursor sits right
 * after the ›, and no bracketed paste. Each menu is known by its › option list and two of its keywords and holds
 * the runtime for a user, but the background server's, which its recording answers.
 */
final readonly class CodexLayout implements DriverLayout
{
    private const int STILL_MS = 300;

    /**
     * The layout of Codex's terminal, as its recordings measured it.
     */
    public function __invoke(): ScreenLayout
    {
        $options = new OptionList('menu', ['› ']);

        $menu = fn (string $name, HoldReason $hold, string ...$keywords) => MenuFamily::of(
            $name,
            $hold,
            $options,
            ...$keywords,
        );

        return new ScreenLayout(
            buffer: 'alternate',
            composer: new MarkedRow('composer', ['› '], [], 3),
            emptyCursorColumn: 2,
            composerStillMs: self::STILL_MS,
            menus: [
                // Recorded in keyscripts/model-choice: its user ran without the daemon, two rows up from Cancel.
                $menu(
                    'background-server',
                    HoldReason::DriverInput,
                    'background server has incompatible feature settings',
                    'run without daemon this time',
                    'restart with these settings',
                )->answeredWith(str_repeat(NavigationKey::Up->bytes(), 2).NavigationKey::Enter->bytes()),
                $menu(
                    'folder-trust',
                    HoldReason::TrustRequired,
                    'trust this folder',
                    'open restricted',
                    'trust and continue',
                    'folder settings',
                ),
                $menu(
                    'hooks-review',
                    HoldReason::TrustRequired,
                    'hooks need review',
                    'trust all',
                    'continue without trusting',
                ),
                $menu(
                    'sign-in',
                    HoldReason::LoginRequired,
                    'sign in with chatgpt',
                    'device code',
                    'provide your own api key',
                    'welcome to codex',
                ),
                $menu(
                    'update',
                    HoldReason::UpdateRequired,
                    'update now',
                    'skip until next version',
                    'update available',
                ),
                $menu('rate-limit', HoldReason::UsageLimited, 'approaching rate limits', 'keep current model'),
                $menu('question', HoldReason::UserInput, 'question requested', 'none of the above', 'free-form'),
                $menu(
                    'resume-session',
                    HoldReason::UserInput,
                    'resume a previous session',
                    'fork a previous session',
                    'current directory',
                ),
                $menu(
                    'reasoning-picker',
                    HoldReason::UserInput,
                    'select reasoning level',
                    'enter default',
                    's session',
                ),
                $menu(
                    'model-picker',
                    HoldReason::UserInput,
                    'select model and effort',
                    '(current)',
                    'enter select',
                    'esc back',
                ),
                $menu(
                    'approval',
                    HoldReason::PermissionRequired,
                    'would you like to',
                    'yes, proceed',
                    'what to do differently',
                    'grant these permissions',
                    'this host',
                ),
            ],
            others: [new MarkedRow('status', [], ['for shortcuts'], 1)],
        );
    }
}
