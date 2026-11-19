<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Contracts\CommandRefusal;
use InvalidArgumentException;

/**
 * Stop conditions that cannot run as defined: too many, too slow, too much output, a repeated key, an executable
 * found by search, or a writing helper without clean-worktree.
 */
final class StopConditionsInvalid extends InvalidArgumentException implements CommandRefusal
{
    public static function tooMany(int $count): self
    {
        return new self("A launch has at most 16 stop conditions, not {$count}.");
    }

    public static function attemptTime(int $seconds): self
    {
        return new self("A stop attempt takes 1 to 120 seconds, not {$seconds}.");
    }

    public static function overAttempt(int $seconds): self
    {
        return new self("The stop conditions together take longer than the attempt's {$seconds} seconds.");
    }

    public static function repeatedKey(string $key): self
    {
        return new self("The stop condition {$key} is defined twice.");
    }

    public static function executableNotAbsolute(string $key): self
    {
        return new self("The stop condition {$key} must name its executable by an absolute path.");
    }

    public static function conditionTime(string $key, int $seconds): self
    {
        return new self("The stop condition {$key} takes 1 to 60 seconds, not {$seconds}.");
    }

    public static function output(string $key, int $bytes): self
    {
        return new self("The stop condition {$key} keeps 1 to 65536 bytes of output, not {$bytes}.");
    }
}
