<?php

declare(strict_types=1);

namespace App\Communication\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use RuntimeException;

/**
 * A question in a chat of more than two members that names nobody to settle it.
 */
final class RespondentRequired extends RuntimeException implements CodedRefusal
{
    use RendersRefusal;

    public static function forInbox(string $inboxId): self
    {
        return new self("Chat {$inboxId} has several members: name the one this question is for.");
    }

    protected function status(): int
    {
        return 422;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }
}
