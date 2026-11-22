<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

/**
 * A domain registered a shareable record type twice, or with a model that is not Shareable or a class that is no
 * share record provider.
 */
final class ShareRecordInvalid extends LogicException
{
    public static function repeated(string $alias): self
    {
        return new self("A shareable record type is already registered under {$alias}.");
    }

    public static function notShareable(string $alias, string $modelClass): self
    {
        return new self("{$modelClass}, registered for sharing as {$alias}, does not implement Shareable.");
    }

    public static function notAProvider(string $alias, string $class): self
    {
        return new self("{$class}, registered for sharing {$alias}, is no share record provider.");
    }
}
