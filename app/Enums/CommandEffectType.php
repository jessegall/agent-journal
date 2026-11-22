<?php

declare(strict_types=1);

namespace App\Enums;

enum CommandEffectType: string
{
    case Recovery = 'recovery';
    case StateChange = 'state_change';
    case AssignmentChange = 'assignment_change';
}
