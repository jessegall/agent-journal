<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use RuntimeException;

/**
 * A runtime asked in a folder its host may not start in, or, for an agent, outside its own host and folder.
 */
final class StartRootRefused extends RuntimeException implements CommandRefusal
{
    public static function outsideRoots(string $folder): self
    {
        return new self("The folder {$folder} is not inside a start root of its host.");
    }

    public static function foreignToAgent(): self
    {
        return new self('An agent opens a child runtime only on its own host, inside its own folder.');
    }
}
