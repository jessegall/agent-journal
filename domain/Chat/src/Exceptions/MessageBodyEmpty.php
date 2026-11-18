<?php

declare(strict_types=1);

namespace Domain\Chat\Exceptions;

use App\Contracts\CommandRefusal;
use InvalidArgumentException;

final class MessageBodyEmpty extends InvalidArgumentException implements CommandRefusal
{
    public static function forSend(): self
    {
        return new self('A message needs some text.');
    }
}
