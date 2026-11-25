<?php

declare(strict_types=1);

namespace Domain\Documents\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use App\Exceptions\Concerns\ThrowsLater;
use RuntimeException;

/**
 * An edit of a draft that is not open for this editor.
 */
final class DraftMissing extends RuntimeException implements CodedRefusal, CommandRefusal
{
    /** @use ThrowsLater<DraftMissing> */
    use ThrowsLater;

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
