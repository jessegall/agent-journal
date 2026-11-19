<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Enums\StartRefusalType;
use App\Contracts\CommandRefusal;
use InvalidArgumentException;

/**
 * A start that asks for the default model where no default is configured.
 */
final class DefaultUnavailable extends InvalidArgumentException implements CommandRefusal
{
    public static function forStart(): self
    {
        return new self('This start has no configured model default. Name a model, or select a profile with an allowed default.');
    }

    public function reason(): StartRefusalType
    {
        return StartRefusalType::DefaultUnavailable;
    }
}
