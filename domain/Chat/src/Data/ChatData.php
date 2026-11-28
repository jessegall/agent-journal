<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Web\Creation\Buildable;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class ChatData extends Data
{
    /** @use Buildable<ChatDataFields> */
    use Buildable;

    use ChatProperties;

    protected const string FIELDS = ChatDataFields::class;
}
