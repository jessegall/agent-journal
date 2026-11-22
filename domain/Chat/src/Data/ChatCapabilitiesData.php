<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Which membership actions the viewer is offered in a chat, from the same rules the commands check again on
 * submission.
 */
#[TypeScript]
final class ChatCapabilitiesData extends Data
{
    public function __construct(
        public readonly bool $add,
        public readonly bool $remove,
        public readonly bool $transfer,
        public readonly bool $leave,
        public readonly bool $close,
    ) {}
}
