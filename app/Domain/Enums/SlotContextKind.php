<?php

declare(strict_types=1);

namespace App\Domain\Enums;

/**
 * What a slot hands the sections shown in it: nothing, the session chosen in Chat, or the record its page shows.
 */
enum SlotContextKind: string
{
    case Nothing = 'nothing';
    case Session = 'session';
    case Record = 'record';
}
