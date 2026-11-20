<?php

declare(strict_types=1);

namespace Domain\Documents\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Contracts\CommandRefusal;
use App\Text\Exceptions\MarkdownInvalid;
use RuntimeException;

final class DraftMarkdownInvalid extends RuntimeException implements CodedRefusal, CommandRefusal
{
    /**
     * @param list<int> $lines
     */
    public static function onLines(array $lines): self
    {
        return new self('Fix the Markdown on lines '.implode(', ', $lines).' before publishing.');
    }

    public static function fromBody(MarkdownInvalid $problem): self
    {
        return new self($problem->getMessage(), previous: $problem);
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }
}
