<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Values\StackTarget;

interface AgentStackCommand
{
    public function target(): StackTarget;
}
