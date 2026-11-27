<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

final class InvalidActorText extends RuntimeException
{
    public static function for(string $text): self
    {
        return new self("An actor is written as type:id, such as agent:12 or user:1; \"{$text}\" is not.");
    }

    public static function missing(string $name): self
    {
        return new self("{$name} names no actor: write one as type:id, such as agent:12 or user:1.");
    }
}
