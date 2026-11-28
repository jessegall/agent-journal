<?php

declare(strict_types=1);

namespace App\Web\Creation\Exceptions;

use LogicException;

final class InvalidSurface extends LogicException
{
    public static function unowned(string $key, string $type, string $builder): self
    {
        return new self("The surface {$key} must own its result {$type} and builder {$builder}.");
    }

    public static function builder(string $key, string $builder, string $type): self
    {
        return new self("The surface {$key} requires a final builder {$builder} declaring exactly {$type} as its result.");
    }

    public static function repeatedType(string $key, string $type): self
    {
        return new self("The surface {$key} repeats the result type {$type}.");
    }

    public static function sharedComponent(string $key, string $file): self
    {
        return new self("The surface {$key} shares {$file} between page and window roles.");
    }

    public static function windowType(string $key, string $type): self
    {
        return new self("The window {$key} must use its own Data class. It declares {$type}.");
    }
}
