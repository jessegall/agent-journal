<?php

declare(strict_types=1);

namespace App\Web\Data;

use App\Agents\Data\TerminalFrameData;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * An agent's terminal page: the agent, the newest frame after the one the viewer holds, absent when there is none, and
 * the actions the viewer may take on it, which no read gives yet.
 */
#[TypeScript]
final class TerminalWindowData extends Data
{
    public function __construct(
        public readonly string $agentId,
        public readonly TerminalFrameData|Optional $frame = new Optional(),
        public readonly TerminalActionsData|Optional $actions = new Optional(),
    ) {}
}
