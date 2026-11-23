<?php

declare(strict_types=1);

namespace App\Enums;

use App\Support\StartRemedy;

/**
 * Why a proposed driver, variant and placement cannot start, in the words Home and the CLI both show.
 */
enum StartPreflightRefusal: string
{
    case DriverPinned = 'driver-pinned';
    case ModelNotAllowed = 'model-not-allowed';
    case DriverNotContainable = 'driver-not-containable';
    case NoHost = 'no-host';
    case CombinationNotDeclared = 'combination-not-declared';

    public function label(): string
    {
        return match ($this) {
            self::DriverPinned => 'This profile runs only its own driver.',
            self::ModelNotAllowed => 'This profile does not allow that model.',
            self::DriverNotContainable => 'Codex cannot run in a container yet: its sandbox does not keep its tools '
                .'from its sign-in.',
            self::NoHost => 'No connected host runs agents in this place.',
            self::CombinationNotDeclared => 'The host has not said it can run this driver this way.',
        };
    }

    /**
     * The public explanation of this refusal, as the start dialog shows it.
     */
    public function explanation(): string
    {
        return match ($this) {
            self::DriverPinned => 'This profile requires its assigned driver.',
            self::ModelNotAllowed => 'This profile does not allow that model.',
            self::DriverNotContainable => 'This driver cannot run with the required protection here.',
            self::NoHost => 'No connected host serves this environment.',
            self::CombinationNotDeclared => 'The host does not support these settings together.',
        };
    }

    public function remedy(): StartRemedy
    {
        return match ($this) {
            self::DriverPinned => StartRemedy::forEveryone(StartRemedyType::ChooseDriver, 'Use the assigned driver'),
            self::ModelNotAllowed => StartRemedy::forEveryone(StartRemedyType::ChooseModel, 'Choose an allowed model'),
            self::DriverNotContainable => StartRemedy::forEveryone(
                StartRemedyType::ChooseDriver,
                'Choose a supported driver',
            ),
            self::NoHost => StartRemedy::forOperators(StartRemedyType::ConnectHost, 'Connect a host'),
            self::CombinationNotDeclared => StartRemedy::forEveryone(
                StartRemedyType::ReviewConfiguration,
                'Review configuration',
            ),
        };
    }
}
