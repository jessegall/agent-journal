<?php

declare(strict_types=1);

namespace App\Profiles\Values;

/**
 * What a program's own check says about an account folder: signed in or not, who it names, and whether the answer was certain; an unreadable answer proves nothing. Nothing else of its output is kept.
 */
final readonly class SignInVerification
{
    public function __construct(
        public bool $isSignedIn,
        public SignInIdentity $identity,
        public bool $isCertain = true,
    ) {}
}
