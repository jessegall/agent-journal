<?php

declare(strict_types=1);

namespace App\Asks\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class AskCard extends Data
{
    /** @use \App\Web\Creation\Buildable<AskCardFields> */
    use \App\Web\Creation\Buildable;

    protected const string FIELDS = AskCardFields::class;

    public function __construct(
        public readonly string $id,
        public readonly string $type,
        public readonly string $body,
        public readonly bool $isOpen,
        public readonly bool $isObligation,
        public readonly string|null $reply,
        public readonly string|null $holderType,
        public readonly string|null $holderId,
    ) {}
}
