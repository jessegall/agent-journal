<?php

declare(strict_types=1);

namespace App\Web\Creation\Exceptions;

use LogicException;

final class InvalidBuilder extends LogicException
{
    public static function duplicate(string $surface, string $type): self
    {
        return new self("Duplicate {$surface} builder for {$type}");
    }

    public static function registration(string $surface, string $type, string $builder): self
    {
        return new self("Invalid {$surface} registration for {$type}: {$builder}");
    }

    public static function result(string $builder, string $actual, string $expected): self
    {
        return new self("{$builder} built {$actual}, expected {$expected}");
    }
}
