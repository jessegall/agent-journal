<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use LogicException;
use ReflectionMethod;

final class InvalidStateMethod extends LogicException
{
    public static function for(ReflectionMethod $method, string $reason): self
    {
        return self::on($method->getDeclaringClass()->getName(), $method->getName(), $reason);
    }

    public static function on(string $class, string $member, string $reason): self
    {
        return new self("{$class}::{$member} {$reason}");
    }
}
