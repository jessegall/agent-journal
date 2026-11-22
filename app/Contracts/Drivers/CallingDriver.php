<?php

declare(strict_types=1);

namespace App\Contracts\Drivers;

/**
 * The driver of the agent calling in this request, which a profile without a driver of its own starts its helpers
 * on; none when no agent calls.
 */
interface CallingDriver
{
    public function driverKey(): string|null;
}
