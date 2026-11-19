<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\ExecutionModeType;

/**
 * Everything the host needs for one start: the selected program and model, the frozen policy, the assigned
 * workspace and a reference to the host account it uses, never a credential.
 */
final readonly class PreparedStart
{
    public function __construct(
        public string $startId,
        public SelectedProgram $selectedProgram,
        public ExecutionModeType $executionMode,
        public string $policyReference,
        public string $workspace,
        public string $accountReference,
    ) {}
}
