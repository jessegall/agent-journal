<?php

declare(strict_types=1);

namespace App\Drivers\Enums;

/**
 * An operation a driver reports its support for, each answered on its own for the bound host (doc 103, section 4).
 */
enum DriverCapability: string
{
    case Run = 'run';
    case Watch = 'watch';
    case Type = 'type';
    case Paste = 'paste';
    case Resize = 'resize';
    case PrivateEntry = 'private-entry';
    case KeyScripts = 'key-scripts';
    case Interrupt = 'interrupt';
    case TurnModel = 'turn-model';
    case TurnEffort = 'turn-effort';
    case Attachments = 'attachments';
    case HookMethods = 'hook-methods';
    case SignIn = 'sign-in';
    case ExactResume = 'exact-resume';
    case RunContained = 'run-contained';
}
