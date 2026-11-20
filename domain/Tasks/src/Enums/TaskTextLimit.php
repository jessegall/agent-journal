<?php

declare(strict_types=1);

namespace Domain\Tasks\Enums;

/**
 * The most characters each text of a task holds. Plans keep their own in PlanTextLimit: a plan also has a brief,
 * and each domain owns the size of its texts.
 */
enum TaskTextLimit: int
{
    case Title = 240;

    case Note = 8000;
}
