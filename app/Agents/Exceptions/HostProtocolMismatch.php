<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A host that speaks another protocol version than the journal, refused before it can claim anything.
 */
final class HostProtocolMismatch extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function missing(int $current): self
    {
        return new self(sprintf(
            'The host does not say which protocol it speaks; upgrade journal-agent to protocol %d.',
            $current,
        ));
    }

    public static function speaks(string $version, int $current): self
    {
        return new self(sprintf(
            'The host speaks protocol %s and the journal speaks %d; upgrade journal-agent to match the journal.',
            $version,
            $current,
        ));
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }

    protected function status(): int
    {
        return 426;
    }
}
