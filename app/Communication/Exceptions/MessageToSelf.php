<?php

declare(strict_types=1);

namespace App\Communication\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A message whose source and destination are the same inbox.
 */
final class MessageToSelf extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forInbox(string $inboxId): self
    {
        return new self("A message cannot go from inbox {$inboxId} to itself.");
    }

    protected function status(): int
    {
        return 422;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }
}
