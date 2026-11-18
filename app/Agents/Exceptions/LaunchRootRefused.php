<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A runtime asked in a folder its host may not launch in, or, for an agent, outside its own host and folder.
 */
final class LaunchRootRefused extends RuntimeException implements CommandRefusal
{
    public static function outsideRoots(string $folder): self
    {
        return new self("The folder {$folder} is not inside a launch root of its host.");
    }

    public static function foreignToAgent(): self
    {
        return new self('An agent opens a child runtime only on its own host, inside its own folder.');
    }
}
