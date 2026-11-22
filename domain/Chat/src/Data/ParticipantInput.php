<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One member a membership change names, in the chat named by its inbox: the member written as type:id.
 */
#[TypeScript]
final class ParticipantInput extends Data
{
    public function __construct(
        #[Ulid]
        public readonly string $inboxId,
        #[Regex('/^(user|agent):[0-9a-hjkmnp-tv-z]{26}$/i')]
        public readonly string $participant,
    ) {}
}
