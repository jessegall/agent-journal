<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Enums\StartRefusalType;
use App\Contracts\CommandRefusal;
use InvalidArgumentException;

/**
 * A start that names no model, or only blank text.
 */
final class ModelRequired extends InvalidArgumentException implements CommandRefusal
{
    public static function forStart(): self
    {
        return new self('Name a model: use --model <model> or --model default with a configured profile default. Nothing was started.');
    }

    public function reason(): StartRefusalType
    {
        return StartRefusalType::ModelRequired;
    }
}
