<?php

declare(strict_types=1);

namespace App\Terminals\Screens\Enums;

/**
 * What a driver's screen is ready for, as the journal reads it.
 */
enum ScreenType: string
{
    // An empty composer holding the cursor with no menu over it: the driver waits for a prompt.
    case PromptReady = 'prompt_ready';
    // A known menu the driver put up, which keys must answer before anything else.
    case Menu = 'menu';
    // Any other screen: a turn being drawn, a draft in the composer, or a menu nobody recognised.
    case Unknown = 'unknown';
}
