<?php

declare(strict_types=1);

namespace App\Enums\Sessions;

use App\Support\StartRemedy;

/**
 * The stable reason code of a start refused before anything was created.
 */
enum StartRefusalType: string
{
    case ModelRequired = 'model-required';
    case DefaultUnavailable = 'default-unavailable';
    case DriverRequired = 'driver-required';
    case DriverUnsupported = 'driver-unsupported';
    case AccountContainerUnsupported = 'account-container-unsupported';
    case CapabilityUnsupported = 'capability-unsupported';
    case ContextFailed = 'context-failed';
    case ContainerUnavailable = 'container-unavailable';
    case ImageUnverified = 'image-unverified';
    case CapacityUnavailable = 'capacity-unavailable';

    /**
     * The public explanation of this refusal; a capacity refusal that names its resource says it through that resource.
     */
    public function explanation(): string
    {
        return match ($this) {
            self::ModelRequired => 'Choose a model for this session.',
            self::DefaultUnavailable => 'The default model is unavailable.',
            self::DriverRequired => 'Choose a driver for this session.',
            self::DriverUnsupported => 'This driver cannot run here.',
            self::AccountContainerUnsupported => 'This account cannot run in this environment.',
            self::CapabilityUnsupported => 'A required feature is unavailable with these settings.',
            self::ContextFailed => 'The journal could not prepare this session.',
            self::ContainerUnavailable => 'The host cannot provide a container.',
            self::ImageUnverified => 'The host could not verify its agent image.',
            self::CapacityUnavailable => 'The host lacks the required CPU, memory or disk.',
        };
    }

    public function remedy(): StartRemedy
    {
        return match ($this) {
            self::ModelRequired, self::DefaultUnavailable => StartRemedy::forEveryone(
                StartRemedyType::ChooseModel,
                'Choose model',
            ),
            self::DriverRequired => StartRemedy::forEveryone(StartRemedyType::ChooseDriver, 'Choose driver'),
            self::DriverUnsupported => StartRemedy::forEveryone(
                StartRemedyType::ChooseDriver,
                'Choose a supported driver',
            ),
            self::AccountContainerUnsupported => StartRemedy::forEveryone(
                StartRemedyType::ChooseAccount,
                'Choose a compatible account',
            ),
            self::CapabilityUnsupported => StartRemedy::forEveryone(
                StartRemedyType::ReviewConfiguration,
                'Review configuration',
            ),
            self::ContextFailed => StartRemedy::forEveryone(
                StartRemedyType::RetryStart,
                'Retry start when eligible; otherwise ask the operator to check setup',
            ),
            self::ContainerUnavailable => StartRemedy::forOperators(
                StartRemedyType::OperatorInstruction,
                'Restore container service',
            ),
            self::ImageUnverified => StartRemedy::forOperators(
                StartRemedyType::OperatorInstruction,
                'Verify the host image',
            ),
            self::CapacityUnavailable => StartRemedy::forOperators(StartRemedyType::CheckCapacity, 'Check capacity'),
        };
    }
}
