<?php

declare(strict_types=1);

namespace Domain\Documents\Exceptions;

use App\Contracts\CodedRefusal;
use App\Contracts\CommandRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * An edit of a draft that is not open for this editor.
 */
final class DraftMissing extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function unavailable(): self
    {
        return new self('This draft is unavailable.');
    }

    public static function forDocument(int $number): self
    {
        return new self("No draft of doc {$number} is open for you; open it first with doc:open {$number}.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RecordUnavailable;
    }
}
