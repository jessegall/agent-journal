<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * Transaction listeners raised facts whose listeners raised more, deeper than the drain allows: a loop, named by the
 * chain of event classes, never their payloads.
 */
final class CausalDepthExceeded extends RuntimeException
{
    /**
     * @param  list<string>  $chain
     */
    public static function along(array $chain, int $limit): self
    {
        return new self("Transaction listeners raised facts {$limit} deep: ".implode(' -> ', $chain).'.');
    }
}
