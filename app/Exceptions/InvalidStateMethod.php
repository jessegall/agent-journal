<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Support\ReflectedMethod;
use LogicException;

final class InvalidStateMethod extends LogicException
{
    public static function for(ReflectedMethod $method, string $reason): self
    {
        return self::on($method->declaringClass()->name(), $method->name(), $reason);
    }

    public static function on(string $class, string $member, string $reason): self
    {
        return new self("{$class}::{$member} {$reason}");
    }
}
