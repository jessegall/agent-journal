<?php

declare(strict_types=1);

namespace App\Hooks\Enums;

/**
 * Which callback of a frame answered: its enter, its exit, its resume, or a fact the frame listens to.
 */
enum LifecycleStage: string
{
    case Enter = 'enter';
    case Exit = 'exit';
    case Resume = 'resume';
    case Event = 'event';
}
