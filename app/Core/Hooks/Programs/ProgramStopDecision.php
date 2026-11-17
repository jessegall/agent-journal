<?php

declare(strict_types=1);

namespace App\Core\Hooks\Programs;

enum ProgramStopDecision: string
{
    case Block = 'block';
}
