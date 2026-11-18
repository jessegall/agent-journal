<?php

declare(strict_types=1);

namespace App\AgentRequests\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use RuntimeException;
use Throwable;

/**
 * A prepared call the journal did not answer. The message names the address, never the launch token or the body.
 */
final class JournalUnreachable extends RuntimeException implements CodedRefusal
{
    public static function at(string $journalUrl, Throwable $previous): self
    {
        return new self("The journal at {$journalUrl} did not answer; send the call again shortly.", 0, $previous);
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Unavailable;
    }
}
