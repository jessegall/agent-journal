<?php

declare(strict_types=1);

namespace App\Contracts\Bus;

use App\Values\StackTarget;

interface AgentStackCommand
{
    public function target(): StackTarget;
}
