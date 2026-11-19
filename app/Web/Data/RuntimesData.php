<?php

declare(strict_types=1);

namespace App\Web\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The runtime status page: every runtime with its latest requests. Reading it writes nothing; its buttons run the
 * owner's recovery commands.
 */
#[TypeScript]
final class RuntimesData extends Data
{
    /**
     * @param  list<RuntimeEntryData>  $runtimes
     */
    public function __construct(
        #[DataCollectionOf(RuntimeEntryData::class)]
        public readonly array $runtimes,
    ) {}
}
