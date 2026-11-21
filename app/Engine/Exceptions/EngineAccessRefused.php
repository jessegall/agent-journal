<?php

declare(strict_types=1);

namespace App\Engine\Exceptions;

use App\Agents\Values\StackTarget;
use RuntimeException;

final class EngineAccessRefused extends RuntimeException
{
    public static function ungranted(): self
    {
        return new self('The engine acts without a frame or maintenance grant, so it may do nothing.');
    }

    public static function forTarget(StackTarget $target, string $grant): self
    {
        return new self("The engine may not act on {$target->description()}: it holds {$grant}.");
    }

    public static function forMaintenance(string $capability, string $grant): self
    {
        return new self("The engine may not use the maintenance capability {$capability}: it holds {$grant}.");
    }
}
