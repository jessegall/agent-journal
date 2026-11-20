<?php

declare(strict_types=1);

namespace App\Scripts\Enums;

enum StepStatus: string
{
    case Completed = 'completed';
    case Failed = 'failed';
    case Pending = 'pending';
    case Uncertain = 'uncertain';
}
