<?php

declare(strict_types=1);

namespace App\Contracts\Bus;

use App\Values\StackTarget;

interface AgentStackCommand
{
    /**
     * The agent stack the command works on.
     */
    public function target(): StackTarget;
}
