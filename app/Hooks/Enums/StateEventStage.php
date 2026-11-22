<?php

declare(strict_types=1);

namespace App\Hooks\Enums;

/**
 * The delivery stage at which an event can fail.
 */
enum StateEventStage: string
{
    case Collection = 'collection';
    case Effects = 'effects';
}
