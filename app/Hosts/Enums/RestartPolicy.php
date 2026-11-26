<?php

declare(strict_types=1);

namespace App\Hosts\Enums;

/**
 * Whether a host starts a crashed process again on its own.
 */
enum RestartPolicy: string
{
    case Never = 'never';
    case OnCrash = 'on_crash';
}
