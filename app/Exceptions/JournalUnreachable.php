<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use Throwable;

/**
 * A prepared call the journal did not answer. The message names the address, never the start token or the body.
 */
final class JournalUnreachable extends CallFailed implements CodedRefusal
{
    public static function at(string $url, Throwable $previous): self
    {
        return new self("The journal at {$url} did not answer; send the call again shortly.", 0, $previous);
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Unavailable;
    }
}
