<?php

declare(strict_types=1);

namespace App\Skills\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

final class SkillRequestReused extends RuntimeException implements CommandRefusal
{
    public static function for(string $requestId): self
    {
        return new self("The request id {$requestId} was already used for other content; send new content under a new request id.");
    }
}
