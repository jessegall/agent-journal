<?php

declare(strict_types=1);

namespace App\Domain\Chat\Exceptions;

use InvalidArgumentException;

final class MessageBodyEmpty extends InvalidArgumentException
{
    public static function forSend(): self
    {
        return new self('A message needs some text.');
    }
}
