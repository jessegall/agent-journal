<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A round of the main agent the journal does not send: stale, not allowed, or for a request no longer answered.
 */
final class NavigationAnswerRefused extends RuntimeException implements CommandRefusal
{
    public static function staleVersion(string $navigationId, int $expected, int $current, int $generation): self
    {
        return new self("Navigation request {$navigationId} is at row version {$current} on screen generation "
            ."{$generation}, not {$expected}; read it again with navigation show.");
    }

    public static function staleScreen(string $navigationId, int $answered, int $current): self
    {
        return new self("Navigation request {$navigationId} shows screen generation {$current}, not {$answered}; "
            .'read the newer screen first.');
    }

    public static function keyNotAllowed(string $key): self
    {
        return new self("The key {$key} is not one a round may press: up, down, left, right, enter, esc, tab, space, "
            .'a digit, y or n.');
    }

    public static function noKeys(): self
    {
        return new self('A round of keys names at least one key.');
    }

    public static function labelNotAllowed(int $most): self
    {
        return new self("A label is between 1 and {$most} characters.");
    }

    public static function freeText(string $parameter): self
    {
        return new self("The goal has no parameter {$parameter}; a round types only a goal parameter's value.");
    }

    public static function notAnswerable(string $navigationId, string $state): self
    {
        return new self("Navigation request {$navigationId} is {$state}; it takes no round.");
    }

    public static function notYours(string $navigationId): self
    {
        return new self("Navigation request {$navigationId} is answered by the main desk's occupant or the owner.");
    }
}
