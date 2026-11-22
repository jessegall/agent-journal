<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\CodedRefusal;
use App\Contracts\CommandRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * A presence report the binding does not take: from another host, for a revoked binding, or from a new boot while
 * another is live and it asked for no takeover.
 */
final class PresenceRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    private int $status = 403;

    public static function notTheHost(string $bindingId): self
    {
        return new self(
            "Only the host of binding {$bindingId} reports its presence, and only while it is not revoked.",
        );
    }

    public static function notReadableBy(string $bindingId): self
    {
        return new self("Only the host of binding {$bindingId} reads its status.");
    }

    public static function anotherBootIsLive(string $bindingId): self
    {
        $refusal = new self("Another boot of binding {$bindingId} is live; take over to replace it.");
        $refusal->status = 409;

        return $refusal;
    }

    public function refusalCode(): RefusalCode
    {
        return $this->status === 409 ? RefusalCode::Conflict : RefusalCode::Forbidden;
    }

    protected function status(): int
    {
        return $this->status;
    }
}
