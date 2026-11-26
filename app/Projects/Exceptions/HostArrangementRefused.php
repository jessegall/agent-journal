<?php

declare(strict_types=1);

namespace App\Projects\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use App\Projects\Enums\ArrangementType;
use RuntimeException;

/**
 * A start on a host whose arrangement differs from the journal's, refused before anything is created.
 */
final class HostArrangementRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function localHost(): self
    {
        return new self('This journal runs agents in containers; enroll the agent-host service.');
    }

    public static function containedHost(): self
    {
        return new self('This journal runs agents on its own machine; the host is a contained host.');
    }

    public static function unlikeEnrollment(ArrangementType $reported, ArrangementType $enrolled): self
    {
        return new self(
            "The host runs agents {$reported->value}, but it was enrolled as {$enrolled->value}: enroll it again.",
        );
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }

    protected function status(): int
    {
        return 409;
    }
}
