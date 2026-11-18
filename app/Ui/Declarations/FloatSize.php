<?php

declare(strict_types=1);

namespace App\Ui\Declarations;

use App\Ui\Exceptions\InvalidPageDeclaration;

/**
 * The size in pixels a page's window opens at when it is detached as a floating window.
 */
final readonly class FloatSize
{
    private function __construct(
        public int $width,
        public int $height,
    ) {}

    public static function of(int $width, int $height): self
    {
        if ($width <= 0 || $height <= 0) {
            throw InvalidPageDeclaration::floatSizeNotPositive($width, $height);
        }

        return new self($width, $height);
    }

    public static function standard(): self
    {
        return new self(560, 640);
    }
}
