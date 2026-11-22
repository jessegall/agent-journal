<?php

declare(strict_types=1);

namespace Domain\Sequences\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One step of a sequence definition as the editor holds it: its own id, which names it in an error, its title, when it
 * runs and when it is done.
 */
#[TypeScript]
final class SequenceStepData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $title,
        public readonly string $runsWhen,
        public readonly string $doneWhen,
    ) {}
}
