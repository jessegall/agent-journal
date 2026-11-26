<?php

declare(strict_types=1);

namespace App\Support;

use App\Bus\Contracts\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Contracts\Refusals\StaleRefusal;
use Illuminate\Support\Str;

/**
 * Why a browser's change was refused, as its caller reads it: a stable code and the HTTP status. A stale refusal
 * names what went stale and answers 409; another refusal is named after its class and answers its own status, or
 * 403 when it gives none.
 */
final readonly class RefusalReason
{
    private function __construct(public string $code, public int $status) {}

    public static function of(CommandRefusal $refusal): self
    {
        if ($refusal instanceof StaleRefusal) {
            return new self($refusal->staleCode(), 409);
        }

        $code = Str::kebab(class_basename($refusal));

        if ($refusal instanceof CodedRefusal) {
            return new self($code, $refusal->refusalCode()->status());
        }

        return new self($code, 403);
    }
}
