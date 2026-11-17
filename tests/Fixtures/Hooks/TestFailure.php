<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use RuntimeException;

/**
 * A failure a test causes on purpose, named for what it stands for.
 */
final class TestFailure extends RuntimeException
{
    public static function renderedOnReplay(): self
    {
        return new self('A replay must send the recorded reply and render nothing.');
    }

    public static function failedAfterTheStart(): self
    {
        return new self('Something after the start failed, so the start rolls back.');
    }

    public static function adapterFailed(): self
    {
        return new self('The program adapter failed before the commit.');
    }

    public static function lockHolderDidNotStart(): self
    {
        return new self('The lock holder process did not start.');
    }

    public static function lockHolderSaid(string $line): self
    {
        return new self("The lock holder said {$line} instead of locked.");
    }

    public static function listenerFailed(): self
    {
        return new self('The first listener run fails.');
    }
}
