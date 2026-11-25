<?php

declare(strict_types=1);

namespace Domain\Comments\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use RuntimeException;

/**
 * A comment's place mixes or leaves out fields, so it names no one section, span of lines or quote.
 */
final class CommentPlaceUnclear extends RuntimeException implements CodedRefusal
{
    use RendersRefusal;

    public static function given(): self
    {
        return new self(
            'Point at the whole record (no place), or at one section, one span of lines, or one quote with its version.',
        );
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }

    protected function status(): int
    {
        return 422;
    }
}
