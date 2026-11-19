<?php

declare(strict_types=1);

namespace App\Profiles\Values;

/**
 * What a program's own check says about an account folder: signed in or not, and the identity it names when it
 * names one. Nothing else of the program's output is kept.
 */
final readonly class SignInVerification
{
    public function __construct(
        public bool $isSignedIn,
        public string|null $identity,
    ) {}
}
