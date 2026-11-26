<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Contracts;

/**
 * The driver of the agent calling in this request, which a profile without a driver of its own starts its helpers
 * on; none when no agent calls.
 */
interface CallingDriver
{
    /**
     * The key of the driver the running request came through; none outside a driver call.
     */
    public function driverKey(): string|null;
}
