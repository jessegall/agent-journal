<?php

declare(strict_types=1);

namespace App\Processes\Exceptions;

use RuntimeException;

/**
 * A tree was asked for a node it does not hold.
 */
final class ShellNodeMissing extends RuntimeException
{
    public static function withId(int $id): self
    {
        return new self("The shell tree holds no node {$id}.");
    }
}
