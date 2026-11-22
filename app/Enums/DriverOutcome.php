<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * What became of an operation a driver was asked to carry out.
 */
enum DriverOutcome: string
{
    case Unavailable = 'unavailable';
    case Held = 'held';
    case Applied = 'applied';
    case AlreadyIdle = 'already-idle';
    case StaleGeneration = 'stale-generation';
    case Uncertain = 'uncertain';
    case Failed = 'failed';
}
