<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Enums\LaunchRefusalType;
use App\Contracts\CommandRefusal;
use InvalidArgumentException;

/**
 * A launch that names no model, or only blank text.
 */
final class ModelRequired extends InvalidArgumentException implements CommandRefusal
{
    public static function forLaunch(): self
    {
        return new self('Name a model: use --model <model> or --model default with a configured profile default. Nothing was launched.');
    }

    public function reason(): LaunchRefusalType
    {
        return LaunchRefusalType::ModelRequired;
    }
}
