<?php

declare(strict_types=1);

namespace App\Terminals\Screens\Enums;

/**
 * What a key script does on the frame it read.
 */
enum KeyMoveType: string
{
    // The step's screen is not there yet: nothing is sent.
    case Wait = 'wait';
    // Keys go to the driver, guarded by the rows they were read on.
    case Send = 'send';
    // The script's last step saw its screen.
    case Finished = 'finished';
    // The script stops without a key on a screen it cannot be certain of, for the main agent to navigate.
    case Uncertain = 'uncertain';
    // The script fails without a key: its step's screen never came and nothing on screen can be picked.
    case Failed = 'failed';
}
