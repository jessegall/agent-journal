<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Domain\Chat\Enums\DockOutcome;
use Domain\Chat\Values\DockResult;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A dock's answer as the browser reads it: its outcome and the placement, when there is one.
 */
#[TypeScript]
final class DockAnswerData extends Data
{
    public function __construct(
        public readonly DockOutcome $outcome,
        public readonly string|null $placementId,
    ) {}

    public static function fromDockResult(DockResult $result): self
    {
        return self::from(['outcome' => $result->outcome, 'placementId' => $result->placementId]);
    }
}
