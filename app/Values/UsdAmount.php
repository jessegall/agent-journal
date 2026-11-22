<?php

declare(strict_types=1);

namespace App\Values;

use App\Exceptions\UsdAmountInvalid;
use Brick\Math\BigDecimal;

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
        if (preg_match('/^\d{1,12}(\.\d{1,12})?$/', $text) !== 1) {
            throw UsdAmountInvalid::for($text);
        }

        return new self(BigDecimal::of($text)->toScale(self::MOST_DECIMALS)->toString());
    }
}
