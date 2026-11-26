<?php

declare(strict_types=1);

namespace App\Profiles\Data;

use App\Models\Profiles\ProfileStepResult;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One recorded step of a profile run: how it ended, the port it left by and its bounded evidence.
 */
#[TypeScript]
final class ProfileStepData extends Data
{
    public function __construct(
        public readonly string $step,
        public readonly string $status,
        public readonly string|null $port,
        public readonly string|null $evidence,
    ) {}

    public static function fromResult(ProfileStepResult $result): self
    {
        return new self($result->step_reference, $result->status->value, $result->port, $result->evidence);
    }
}
