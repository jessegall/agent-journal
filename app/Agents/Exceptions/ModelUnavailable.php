<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Enums\LaunchRefusalType;
use App\Contracts\CommandRefusal;
use InvalidArgumentException;

/**
 * A named model the profile does not allow for the program.
 */
final class ModelUnavailable extends InvalidArgumentException implements CommandRefusal
{
    public static function for(string $model, string $program): self
    {
        return new self(
            "Model {$model} is not allowed for {$program} with this profile. Name an allowed model. Nothing was "
                .'launched.',
        );
    }

    public function reason(): LaunchRefusalType
    {
        return LaunchRefusalType::ModelUnavailable;
    }
}
