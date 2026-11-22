<?php

declare(strict_types=1);

namespace App\Values;

/**
 * What a sign-in method's card says, in its driver's own words: its title, how it works, what pays for it and, for a
 * token or key, where to get one.
 */
final readonly class SignInCard
{
    public const string CHECK_SENDS_A_REQUEST = ' Checking it may send one small request with it.';

    public function __construct(
        public string $title,
        public string $description,
        public string $billingNote,
        public string|null $secretSource,
    ) {}
}
