<?php

declare(strict_types=1);

namespace App\Processes\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A reader cannot be proposed for this request: another actor asked, the request is closed, or the named declaration
 * revision does not exist or carries no contract to read under.
 */
final class ReaderProposalRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function notTheRequester(string $requestId): self
    {
        return new self("Only the actor who opened request {$requestId}, or a user, may propose its reader.");
    }

    public static function closed(string $requestId): self
    {
        return new self("Request {$requestId} is closed; a new attempt opens a new request.");
    }

    public static function declarationMissing(string $requestId, int $revision): self
    {
        return new self("Request {$requestId} has no proposed declaration at revision {$revision}; propose it first.");
    }

    public static function noContract(string $requestId, int $revision): self
    {
        return new self(
            "Request {$requestId}'s declaration revision {$revision} is no test, check or build, so it has no reader.",
        );
    }

    protected function status(): int
    {
        return 409;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }
}
