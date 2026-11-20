<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Profiles\Exceptions\SignInCodeInvalid;

/**
 * A code the user typed for a sign-in: trimmed, 1 to 512 characters, one line with no control character, so it is
 * typed into the program as nothing but itself.
 */
final readonly class SignInCode
{
    private const int LIMIT = 512;

    private function __construct(public string $code) {}

    /**
     * @throws SignInCodeInvalid
     */
    public static function from(string $text): self
    {
        $code = trim($text);

        if ($code === '' || strlen($code) > self::LIMIT || preg_match('/[\p{Cc}]/u', $code) === 1) {
            throw SignInCodeInvalid::make();
        }

        return new self($code);
    }
}
