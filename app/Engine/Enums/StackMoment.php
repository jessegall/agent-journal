<?php

declare(strict_types=1);

namespace App\Engine\Enums;

/**
 * A moment in a frame's life on its stack, named by the state method that answers it.
 */
enum StackMoment: string
{
    case Enter = 'onEnter';
    case Resume = 'onResume';
    case Exit = 'onExit';
}
