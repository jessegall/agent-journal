<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\ExecutionModeType;
use App\Values\SelectedDriver;

/**
 * Everything the host needs for one committed start: the runtime and session it belongs to, the selected driver and
 * model, the frozen policy, the assigned workspace and a reference to the host account it uses, never a credential.
 */
final readonly class PreparedStart
{
    public function __construct(
        public string $startId,
        public string $runtimeId,
        public string $sessionId,
        public SelectedDriver $selectedDriver,
        public ExecutionModeType $executionMode,
        public string $policyReference,
        public string $workspace,
        public string $accountReference,
    ) {}
}
