<?php

declare(strict_types=1);

namespace Domain\Plans\Exceptions;

use App\Notifications\Contracts\Refusals\FieldRefusal;
use RuntimeException;

/**
 * The plan cannot start in the state it is in; the message is safe to show to whoever asked.
 */
final class StartDenied extends RuntimeException implements FieldRefusal
{
    public static function inState(int $number, string $state): self
    {
        return new self("Plan {$number} is {$state} and cannot start; only a planned plan starts.");
    }

    public function field(): string
    {
        return 'start';
    }

    public function fieldError(): string
    {
        return $this->getMessage();
    }
}
