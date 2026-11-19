<?php

declare(strict_types=1);

namespace App\AgentRequests\Exceptions;

use LogicException;

/**
 * A keyed write whose receipt the bus keeps ended without taking one, so a client's retry could apply it twice.
 */
final class KeyedWriteWithoutReceipt extends LogicException
{
    /**
     * @param  class-string  $call
     */
    public static function for(string $call): self
    {
        return new self("{$call} is a keyed write the bus keeps the receipt of, but the request took no receipt.");
    }
}
