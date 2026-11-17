<?php

declare(strict_types=1);

namespace App\Domain\Chat\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The agent the chat talks to, as the bars at the top of Home name it.
 */
#[TypeScript]
final class ChosenAgentData extends Data
{
    public function __construct(public readonly string $label) {}
}
