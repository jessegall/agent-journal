<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

/**
 * The program of the agent calling in this request, which a profile without a program of its own starts its helpers
 * on; none when no agent calls.
 */
interface CallingProgram
{
    public function programKey(): string|null;
}
