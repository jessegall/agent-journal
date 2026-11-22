<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Contracts\StartRefusal;
use App\Agents\Enums\StartRefusalType;
use InvalidArgumentException;

/**
 * A named model the profile does not allow for the program.
 */
final class ModelUnavailable extends InvalidArgumentException implements StartRefusal
{
    public static function for(string $model, string $driver): self
    {
        return new self(
            sprintf(
                'Model %s is not allowed for %s with this profile. Name an allowed model. Nothing was started.',
                $model,
                $driver,
            ),
        );
    }

    public function reason(): StartRefusalType
    {
        return StartRefusalType::ModelUnavailable;
    }
}
