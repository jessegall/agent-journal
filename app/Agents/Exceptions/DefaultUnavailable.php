<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Enums\LaunchRefusalType;
use App\Contracts\CommandRefusal;
use InvalidArgumentException;

/**
 * A launch that asks for the default model where no default is configured.
 */
final class DefaultUnavailable extends InvalidArgumentException implements CommandRefusal
{
    public static function forLaunch(): self
    {
        return new self('This launch has no configured model default. Name a model, or select a profile with an '
            .'allowed default.');
    }

    public function reason(): LaunchRefusalType
    {
        return LaunchRefusalType::DefaultUnavailable;
    }
}
