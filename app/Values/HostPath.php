<?php

declare(strict_types=1);

namespace App\Values;

/**
 * A path a driver reads from its plan: resolved when the model controls no folder of it.
 */
final readonly class HostPath
{
    public function __construct(public string $path) {}

    /**
     * Absolute and clean, or under a folder the host names itself, with no other placeholder or variable in it.
     */
    public function isResolved(): bool
    {
        $rest = (string) preg_replace('/^\{(?:host:[A-Z_]+|folder:[a-z-]+)\}/', '', $this->path, 1, $named);

        if ($named === 1 && $rest === '') {
            return true;
        }

        return str_starts_with($rest, '/') && preg_match('#[$%{}<>]|/\.\.?(/|$)|//#', $rest) === 0;
    }
}
