<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Web\Attributes\Live;
use App\Web\Attributes\Optional as OptionalProp;
use App\Web\Attributes\WindowOnly;
use App\Web\Creation\Buildable;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
#[WindowOnly, OptionalProp, Live]
final class ChatWindowData extends Data
{
    /** @use Buildable<ChatWindowDataFields> */
    use Buildable;

    use ChatProperties;

    protected const string FIELDS = ChatWindowDataFields::class;
}
