<?php

declare(strict_types=1);

namespace App\Hosts\Enums;

/**
 * Where a host's driver image stands: reserved and not built yet, building, built and waiting for the runner to allow
 * it, its start checks running, ready for starts, or refused for good.
 */
enum DriverImageStatus: string
{
    case Pending = 'pending';
    case Building = 'building';
    case Allowing = 'allowing';
    case Checking = 'checking';
    case Ready = 'ready';
    case Refused = 'refused';
}
