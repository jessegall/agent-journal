<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Support\StackTarget;

interface TargetsAgentStack
{
    public function target(): StackTarget;
}
