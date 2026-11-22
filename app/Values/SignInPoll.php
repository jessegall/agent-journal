<?php

declare(strict_types=1);

namespace App\Values;

/**
 * What the host's runner learns on each cycle of a sign-in: whether the attempt is still live in the generation it
 * runs in, and the code the user typed, once, which only a live attempt hands out.
 */
final readonly class SignInPoll
{
    public function __construct(
        public bool $isLive,
        public string|null $code,
    ) {}

    public static function ended(): self
    {
        return new self(false, null);
    }
}
