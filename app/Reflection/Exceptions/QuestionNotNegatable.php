<?php

declare(strict_types=1);

namespace App\Reflection\Exceptions;

use LogicException;

/**
 * not() was asked something that is no yes-or-no question of a Reflector, so it has no answer to turn around.
 */
final class QuestionNotNegatable extends LogicException
{
    public static function for(string $method): self
    {
        return new self("Reflector::{$method}() answers no yes or no, so not() cannot turn it around.");
    }
}
