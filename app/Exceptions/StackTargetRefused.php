<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Exceptions\Concerns\ThrowsLater;
use App\Notifications\Contracts\Refusals\FieldRefusal;
use RuntimeException;

final class StackTargetRefused extends RuntimeException implements FieldRefusal
{
    /**
     * @use ThrowsLater<StackTargetRefused>
     */
    use ThrowsLater;

    public static function forTarget(string $target): self
    {
        return new self("This request may not change the stack of {$target}.");
    }

    public function field(): string
    {
        return 'session';
    }

    public function fieldError(): string
    {
        return 'This agent session cannot take a message now.';
    }
}
