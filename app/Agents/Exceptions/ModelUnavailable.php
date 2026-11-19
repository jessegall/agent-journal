<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Enums\StartRefusalType;
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
            sprintf(
                'Model %s is not allowed for %s with this profile. Name an allowed model. Nothing was started.',
                $model,
                $program,
            ),
        );
    }

    public function reason(): StartRefusalType
    {
        return StartRefusalType::ModelUnavailable;
    }
}
