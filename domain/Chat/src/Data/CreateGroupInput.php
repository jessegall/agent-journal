<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\Validation\ArrayType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A new group chat: its title and the users it starts with.
 */
#[TypeScript]
final class CreateGroupInput extends Data
{
    /**
     * @param  list<string>  $userIds
     */
    public function __construct(
        #[Regex('/\\S/'), Max(120)]
        public readonly string $title,
        #[ArrayType, Max(99)]
        public readonly array $userIds,
    ) {}
}
