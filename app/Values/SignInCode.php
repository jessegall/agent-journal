<?php

declare(strict_types=1);

namespace App\Values;

use App\Exceptions\SignInCodeInvalid;

/**
 * A code the user typed for a sign-in: trimmed, 1 to 512 bytes, one word with no control character, so it is
 * typed into the driver as nothing but itself.
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
        return new self(self::oneLine($text, 'sign-in code', self::LIMIT));
    }

    /**
     * The text trimmed, when it is 1 to the limit's bytes on one line with no control character.
     *
     * @throws SignInCodeInvalid
     */
    public static function oneLine(string $text, string $what, int $limit): string
    {
        $line = trim($text);

        if ($line === '' || strlen($line) > $limit || preg_match('/[\p{Cc}]/u', $line) === 1) {
            throw SignInCodeInvalid::make($what, $limit);
        }

        if (preg_match('/\s/u', $line) === 1) {
            throw SignInCodeInvalid::withSpace($what);
        }

        return $line;
    }
}
