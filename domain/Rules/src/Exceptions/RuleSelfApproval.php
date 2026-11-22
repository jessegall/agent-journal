<?php

declare(strict_types=1);

namespace Domain\Rules\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use RuntimeException;

final class RuleSelfApproval extends RuntimeException implements CommandRefusal
{
    public static function forRule(): self
    {
        return new self('Nobody approves a rule they proposed; another actor must approve it.');
    }
}
