<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use InvalidArgumentException;

/**
 * A stored or proposed grant that is not exactly a policy class and one of its accesses.
 */
final class GrantShapeInvalid extends InvalidArgumentException implements CommandRefusal
{
    /**
     * @param  list<int|string>  $keys
     */
    public static function for(array $keys): self
    {
        return new self(sprintf(
            'A grant is exactly a policy class and an access; this one has %s.',
            $keys === [] ? 'no keys' : implode(', ', $keys),
        ));
    }
}
