<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

/**
 * A numbered model the application cannot start with.
 */
final class NumberedModelInvalid extends LogicException
{
    public static function notNumbered(string $model): self
    {
        return new self("{$model} implements Numbered but does not use the HasNumber trait.");
    }

    public static function tableTwice(string $table): self
    {
        return new self("Two numbered models share the table {$table}; give each its own.");
    }
}
