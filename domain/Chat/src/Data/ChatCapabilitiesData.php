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
        public readonly bool $canAdd,
        public readonly bool $canRemove,
        public readonly bool $canTransfer,
        public readonly bool $canLeave,
        public readonly bool $canClose,
    ) {}
}
