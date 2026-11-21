<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * The stable reason code of a start refused before anything was created.
 */
enum StartRefusalType: string
{
    case ModelRequired = 'model-required';
    case ModelUnavailable = 'model-unavailable';
    case DefaultUnavailable = 'default-unavailable';
    case DriverRequired = 'driver-required';
    case DriverConflict = 'driver-conflict';
    case DriverUnsupported = 'driver-unsupported';
    case AccountContainerUnsupported = 'account-container-unsupported';
    case CapabilityUnsupported = 'capability-unsupported';
    case ContextFailed = 'context-failed';
    case ContainerUnavailable = 'container-unavailable';
    case ImageUnverified = 'image-unverified';
    case CapacityUnavailable = 'capacity-unavailable';
}
