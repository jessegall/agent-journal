<?php

declare(strict_types=1);

namespace App\Values;

/**
 * What the user needs to approve a sign-in: the address to open and, for a device sign-in, the code to enter
 * there. It is shown only through the no-store challenge read and never kept in the database, a page or an event.
 */
final readonly class SignInChallenge
{
    public function __construct(
        public string $address,
        public string|null $code,
    ) {}
}
