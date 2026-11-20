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

    public static function fromBody(MarkdownInvalid $markdownIssue): self
    {
        return new self($markdownIssue->getMessage(), previous: $markdownIssue);
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }
}
