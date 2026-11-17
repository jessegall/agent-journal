<?php

declare(strict_types=1);

namespace App\Core\Assignments\Exceptions;

use App\Core\Assignments\Exceptions\Concerns\RendersRefusal;
use InvalidArgumentException;

final class InvalidAssignmentIdentity extends InvalidArgumentException
{
    use RendersRefusal;

    public static function forType(string $type): self
    {
        return new self("A record type is a link alias such as tasks.task; \"{$type}\" is not one.");
    }

    public static function forId(string $type, int $id): self
    {
        return new self("A {$type} id is a positive whole number; {$id} is not one.");
    }

    public static function forReference(int $id): self
    {
        return new self("An assignment reference is a positive whole number; {$id} is not one.");
    }

    public static function forActorText(string $text): self
    {
        return new self("An actor is written as kind:id, such as agent:12 or user:1; \"{$text}\" is not.");
    }

    protected function status(): int
    {
        return 422;
    }
}
