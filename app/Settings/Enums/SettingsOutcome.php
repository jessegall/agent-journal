<?php

declare(strict_types=1);

namespace App\Settings\Enums;

/**
 * What a settings command did: changed the stored settings, or found them already as asked.
 */
enum SettingsOutcome: string
{
    case Changed = 'changed';
    case Unchanged = 'unchanged';
}
