<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * What one change did to a receipt: it arrived, its read or visible state changed, or it left the reader's list.
 */
enum NotificationMutationType: string
{
    case Create = 'create';
    case Update = 'update';
    case Remove = 'remove';
}
