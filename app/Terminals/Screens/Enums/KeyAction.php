<?php

declare(strict_types=1);

namespace App\Terminals\Screens\Enums;

/**
 * What one step of a key script does once its screen is there.
 */
enum KeyAction: string
{
    // Sends the step's keys, such as a typed command or one key.
    case PressKeys = 'press_keys';
    // Sends the step's keys only if its screen comes; once the step after it is met first, it is passed over.
    case PressIfShown = 'press_if_shown';
    // Sends nothing and only waits for its screen, as a script's last step waits for the driver's own proof.
    case WaitForScreen = 'wait_for_screen';
    // Moves the menu's highlight onto the entry its label names, one arrow at a time; a label not shown sends nothing.
    case SelectEntry = 'select_entry';
    // Selects the entry, checks the highlight is on it, and only then presses Enter.
    case ChooseEntry = 'choose_entry';
    // Presses Enter only when the highlight is already on the entry its label names; it moves nothing.
    case ConfirmEntry = 'confirm_entry';
}
