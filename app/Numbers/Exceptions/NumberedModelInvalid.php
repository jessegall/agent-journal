<?php

declare(strict_types=1);

namespace App\Numbers\Exceptions;

use LogicException;

/**
 * A numbered model declaration the application cannot start with.
 */
final class NumberedModelInvalid extends LogicException
{
    public static function notNumbered(string $model): self
    {
        return new self("{$model} is declared as numbered but does not implement Numbered with the HasNumber trait.");
    }

    public static function withoutLinkType(string $model): self
    {
        return new self("{$model} is declared as numbered but has no registered link type to name its number group.");
    }

    public static function linkTypeTwice(string $linkType): self
    {
        return new self("Two numbered models share the link type {$linkType}; give each its own.");
    }

    public static function tableTwice(string $table): self
    {
        return new self("Two numbered models share the table {$table}; declare each table once.");
    }
}
