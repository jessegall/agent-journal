<?php

declare(strict_types=1);

namespace App\Hooks\Enums;

/**
 * Which lifecycle callback of a frame answered: its enter, its exit or its resume.
 */
enum LifecycleStage: string
{
    case Enter = 'enter';
    case Exit = 'exit';
    case Resume = 'resume';
}
