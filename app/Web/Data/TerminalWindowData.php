<?php

declare(strict_types=1);

namespace App\Web\Data;

use App\Agents\Data\TerminalFrameData;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * An agent's terminal page: the agent, the id of the read interest the page's open request opened when the page asks
 * for it, and the newest frame after the one the viewer holds, absent when there is none.
 */
#[TypeScript]
final class TerminalWindowData extends Data
{
    public function __construct(
        public readonly string $agentId,
        public readonly string|Optional $readInterestId = new Optional(),
        public readonly TerminalFrameData|Optional $frame = new Optional(),
    ) {}
}
