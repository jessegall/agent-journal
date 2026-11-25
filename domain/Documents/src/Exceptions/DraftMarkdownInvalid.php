<?php

declare(strict_types=1);

namespace Domain\Documents\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use App\Exceptions\MarkdownInvalid;
use RuntimeException;

final class DraftMarkdownInvalid extends RuntimeException implements CodedRefusal, CommandRefusal
{
    /**
     * @param  list<int>  $lines
     */
    public static function onLines(array $lines): self
    {
        return new self('Fix the Markdown on lines '.implode(', ', $lines).' before publishing.');
    }

    public static function fromBody(MarkdownInvalid $issue): self
    {
        return new self($issue->getMessage(), previous: $issue);
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }
}
