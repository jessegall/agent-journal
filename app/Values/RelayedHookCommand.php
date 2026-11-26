<?php

declare(strict_types=1);

namespace App\Values;

/**
 * The hook command a driver's settings run, ending once in the name the hook relay knows the driver by.
 */
final readonly class RelayedHookCommand
{
    private function __construct(public string $text) {}

    public static function for(string $command, string $driverName): self
    {
        return new self(str_ends_with(trim($command), " {$driverName}") ? $command : "{$command} {$driverName}");
    }
}
