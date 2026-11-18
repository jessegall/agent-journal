<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * The operations every driver offers (doc 40, section 51), plus a key script.
 */
enum DriverOperation: string
{
    case Deliver = 'deliver';
    case Wake = 'wake';
    case ChangeModel = 'change_model';
    case ChangeEffort = 'change_effort';
    case Interrupt = 'interrupt';
    case Stop = 'stop';
    case KeyScript = 'key_script';
}
