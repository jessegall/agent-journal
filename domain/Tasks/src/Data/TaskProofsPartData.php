<?php

declare(strict_types=1);

namespace Domain\Tasks\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The props of a task's Proofs tab as a native part: the page of its proofs the reader asked for.
 */
#[TypeScript]
final class TaskProofsPartData extends Data
{
    public function __construct(public readonly TaskProofsData $proofs) {}
}
