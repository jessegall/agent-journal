<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use App\Exceptions\Concerns\ThrowsLater;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;

/**
 * A host names a process the journal does not know, such as one whose rows were removed: it is gone, and the host drops
 * what it holds for it rather than sending it again.
 */
final class HostProcessGone extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    /**
     * @use ThrowsLater<HostProcessGone>
     */
    use ThrowsLater;

    public static function forProcess(string $processId): self
    {
        return new self("The journal knows no process {$processId}; drop what is kept for it.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RecordUnavailable;
    }

    protected function status(): int
    {
        return Response::HTTP_GONE;
    }
}
