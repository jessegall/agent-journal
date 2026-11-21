<?php

declare(strict_types=1);

namespace App\Profiles\Values;

/**
 * What a program's own check says about an account folder: signed in or not, who it names, and whether the answer was
 * certain; an unreadable answer proves nothing. A refused proof keeps the provider's reason, with any key in it
 * replaced; nothing else of the program's output is kept.
 */
final readonly class SignInVerification
{
    private const int MOST_REFUSAL_CHARACTERS = 300;

    public function __construct(
        public bool $isSignedIn,
        public SignInIdentity $identity,
        public bool $isCertain = true,
        public string|null $refusal = null,
    ) {}

    /**
     * A proof the provider refused, with its reason as the program printed it: a key in it is replaced by "the key",
     * a request's address and tracing after it are cut, and it is kept short.
     */
    public static function refused(string $reason): self
    {
        $withoutKey = (string) preg_replace('/\bsk-[A-Za-z0-9*_\-]+/', 'the key', $reason);
        $withoutTrace = explode(', url:', $withoutKey)[0];

        $short = mb_strimwidth(trim($withoutTrace), 0, self::MOST_REFUSAL_CHARACTERS, '…');

        return new self(false, SignInIdentity::unproved(), true, $short);
    }
}
