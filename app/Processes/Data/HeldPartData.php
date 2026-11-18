<?php

declare(strict_types=1);

namespace App\Processes\Data;

use Spatie\LaravelData\Data;

/**
 * One part of an explained line the journal will not run yet: its node, the stable code of why, the canonical
 * operation, and, once explain opened it, the command request that holds it with its state and next allowed command.
 */
final class HeldPartData extends Data
{
    public function __construct(
        public readonly int $node,
        public readonly string $code,
        public readonly string $operation,
        public readonly string $holdReason,
        public readonly string $requestId = '',
        public readonly string $requestState = '',
        public readonly string $next = '',
    ) {}
}
