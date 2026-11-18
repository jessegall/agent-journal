<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use App\Agents\Support\SessionOption;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A running session the viewer may dock a record to, named by its agent.
 */
#[TypeScript]
final class DockSession extends Data
{
    public function __construct(public readonly string $sessionId, public readonly string $agentName) {}

    public static function fromSessionOption(SessionOption $session): self
    {
        return self::from(['sessionId' => $session->sessionId, 'agentName' => $session->agentName]);
    }
}
