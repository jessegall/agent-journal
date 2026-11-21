<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The props of a record's share part: the reference people share it by, such as report 12.
 */
#[TypeScript]
final class RecordSharePartData extends Data
{
    public function __construct(public readonly string $reference) {}
}
