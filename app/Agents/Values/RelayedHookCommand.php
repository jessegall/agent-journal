<?php

declare(strict_types=1);

namespace App\Agents\Values;

use App\Agents\Drivers\Hooks\HookReplies;

/**
 * The hook command a driver's settings run: the hook, once the name it knows the driver by, then the start's sealed
 * reply file.
 */
final readonly class RelayedHookCommand
{
    /**
     * The sealed file the hook answers from while the journal is away, in the start's files folder.
     */
    private const string REPLY_FILE = '{folder:files}/'.HookReplies::REPLY_FILE;

    private function __construct(public string $text) {}

    public static function for(string $command, string $driverName): self
    {
        $named = str_ends_with(trim($command), " {$driverName}") ? $command : "{$command} {$driverName}";

        return new self($named.' '.self::REPLY_FILE);
    }
}
