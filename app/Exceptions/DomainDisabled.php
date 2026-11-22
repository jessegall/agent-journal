<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use RuntimeException;

/**
 * A command of a domain that is switched off, or that requires one that is: it stays registered but does not run.
 */
final class DomainDisabled extends RuntimeException implements CommandRefusal
{
    public static function for(string $owner, string $command): self
    {
        return new self("{$owner} is switched off, so {$command} does not run.");
    }
}
