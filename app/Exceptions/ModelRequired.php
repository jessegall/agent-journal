<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Refusals\StartRefusal;
use App\Enums\Starts\StartRefusalType;
use InvalidArgumentException;

/**
 * A start that names no model, or only blank text.
 */
final class ModelRequired extends InvalidArgumentException implements StartRefusal
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
