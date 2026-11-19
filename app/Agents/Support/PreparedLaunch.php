<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\ExecutionModeType;

/**
 * Everything the host needs to start one launch: the selected program and model, the frozen policy, the assigned
 * workspace and a reference to the host account it uses, never a credential.
 */
final readonly class PreparedLaunch
{
    public function __construct(
        public string $launchId,
        public SelectedProgram $selectedProgram,
        public ExecutionModeType $executionMode,
        public string $policyReference,
        public string $workspace,
        public string $accountReference,
    ) {}
}
