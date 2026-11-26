<?php

declare(strict_types=1);

namespace App\Profiles\Enums;

/**
 * What a slot hands the sections shown in it: nothing, the session chosen in the conversation window, or the record its page shows.
 */
enum SlotContextType: string
{
    case Nothing = 'nothing';
    case Session = 'session';
    case Record = 'record';
}
