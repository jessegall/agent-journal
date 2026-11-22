<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * An agent's terminal page: the agent whose terminal it shows; the page reads its frames through the terminal's JSON
 * actions, never through its props.
 */
#[TypeScript]
final class TerminalWindowData extends Data
{
    public function __construct(
        public readonly string $agentId,
    ) {}
}
