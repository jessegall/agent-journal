<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Programs;

enum NativeStopDecision: string
{
    case Block = 'block';
}
