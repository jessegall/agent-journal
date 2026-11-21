<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Profiles\Exceptions\UsdAmountInvalid;

/**
 * An exact, nonnegative amount of US dollars with at most twelve decimals, kept as its decimal text with all twelve,
 * such as 0.012800000000, so two amounts are equal exactly when their texts are.
 */
final readonly class UsdAmount
{
    public const int MOST_DECIMALS = 12;

    private function __construct(public string $amount) {}

    /**
     * @throws UsdAmountInvalid
     */
    public static function from(string $text): self
    {
        if (preg_match('/^(\d{1,12})(?:\.(\d{1,12}))?$/', $text, $parts) !== 1) {
            throw UsdAmountInvalid::for($text);
        }

        $whole = ltrim($parts[1], '0');
        $fraction = str_pad($parts[2] ?? '', self::MOST_DECIMALS, '0');

        return new self(($whole === '' ? '0' : $whole).'.'.$fraction);
    }
}
