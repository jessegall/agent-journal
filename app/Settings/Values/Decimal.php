<?php

declare(strict_types=1);

namespace App\Settings\Values;

use App\Settings\Exceptions\DecimalInvalid;
use Brick\Math\BigDecimal;
use Brick\Math\Exception\RoundingNecessaryException;

/**
 * An exact base-ten number kept as its canonical text: a minus sign only below zero, no leading zeros, and the
 * fractional digits it was written with. All arithmetic and comparison goes through brick/math, never a float.
 */
final readonly class Decimal
{
    private function __construct(public string $text) {}

    /**
     * Accepts only plain decimal text: an optional minus, digits, and optionally a point followed by digits.
     *
     * @throws DecimalInvalid
     */
    public static function parse(string $text): self
    {
        if (preg_match('/^-?\d+(\.\d+)?$/', $text) !== 1) {
            throw DecimalInvalid::notPlain();
        }

        return new self(BigDecimal::of($text)->toString());
    }

    /**
     * The same number written with exactly this many fractional digits; refused when that would drop a digit.
     *
     * @param  int<0, max>  $scale
     *
     * @throws DecimalInvalid
     */
    public function toScale(int $scale): self
    {
        try {
            return new self($this->number()->toScale($scale)->toString());
        } catch (RoundingNecessaryException $cause) {
            throw DecimalInvalid::tooManyPlaces($scale, previous: $cause);
        }
    }

    /**
     * The number of significant digits.
     */
    public function precision(): int
    {
        return $this->number()->getPrecision();
    }

    /**
     * The number of fractional digits.
     */
    public function scale(): int
    {
        return $this->number()->getScale();
    }

    public function compareTo(self $other): int
    {
        return $this->number()->compareTo($other->number());
    }

    public function isEqualTo(self $other): bool
    {
        return $this->number()->isEqualTo($other->number());
    }

    public function isLessThan(self $other): bool
    {
        return $this->number()->isLessThan($other->number());
    }

    public function isGreaterThan(self $other): bool
    {
        return $this->number()->isGreaterThan($other->number());
    }

    private function number(): BigDecimal
    {
        return BigDecimal::of($this->text);
    }
}
