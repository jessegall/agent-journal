<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * The stable reason code of a launch refused before anything was created.
 */
enum LaunchRefusalType: string
{
    case ModelRequired = 'model-required';
    case ModelUnavailable = 'model-unavailable';
    case DefaultUnavailable = 'default-unavailable';
    case ProgramRequired = 'program-required';
    case ProgramConflict = 'program-conflict';
    case ProgramUnsupported = 'program-unsupported';
    case AccountContainerUnsupported = 'account-container-unsupported';
    case CapabilityUnsupported = 'capability-unsupported';
    case ContextFailed = 'context-failed';
}
