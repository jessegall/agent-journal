<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Profiles\Exceptions\AccountLabelInvalid;

/**
 * The name a user gives a saved account, trimmed, 1 to 80 characters, with no control character or path separator,
 * so it never becomes a path or a command. Two accounts of a driver never share its case-folded form.
 */
final readonly class AccountLabel
{
    public const int LENGTH_LIMIT = 80;

    private function __construct(public string $label) {}

    /**
     * A label proposed from the text a verified sign-in shows, without its control characters and path separators,
     * cut to fit; the fallback, such as the driver's name, when nothing of it is left.
     */
    public static function proposedFrom(string|null $display, string $fallback): self
    {
        $cleaned = trim((string) preg_replace('/[\p{Cc}\/\\\\]/u', '', (string) $display));

        return self::from(mb_substr($cleaned === '' ? $fallback : $cleaned, 0, self::LENGTH_LIMIT));
    }

    /**
     * The numbered variant used when this label is taken, such as 'Work (2)', its base cut so the whole fits.
     */
    public function numbered(int $number): self
    {
        $suffix = " ({$number})";
        $base = rtrim(mb_substr($this->label, 0, self::LENGTH_LIMIT - mb_strlen($suffix)));

        return self::from($base.$suffix);
    }

    /**
     * @throws AccountLabelInvalid
     */
    public static function from(string $text): self
    {
        $label = trim($text);
        $length = mb_strlen($label);

        if ($length < 1 || $length > self::LENGTH_LIMIT || preg_match('/[\p{Cc}\/\\\\]/u', $label) === 1) {
            throw AccountLabelInvalid::for($text);
        }

        return new self($label);
    }

    /**
     * The case-folded form two labels of one driver may not share.
     */
    public function key(): string
    {
        return mb_strtolower($this->label);
    }
}
