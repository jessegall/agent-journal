<?php

declare(strict_types=1);

namespace App\Agents\Pipelines;

use App\Agents\Pipes\KeepNavigationAnswer;
use App\Agents\Pipes\OpenNavigationRequest;
use App\Agents\Pipes\ReplayMenuEntry;
use App\Agents\Pipes\RespectNavigationHold;
use App\Agents\Pipes\WaitForOpenNavigation;
use App\Agents\Support\NavigationRaiseAnswer;
use App\Pipelines\Contracts\PipelineDefinition;
use App\Pipelines\Support\Step;

/**
 * Answers a locked raise with the first admission decision that applies.
 */
final readonly class ResolveNavigationAdmissionPipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return array_map(
            fn (string $pipe) => Step::resolvedBy(
                static fn (NavigationAdmission|NavigationRaiseAnswer $raise): string => $raise instanceof NavigationAdmission ? $pipe : KeepNavigationAnswer::class,
            ),
            [
                ReplayMenuEntry::class,
                RespectNavigationHold::class,
                WaitForOpenNavigation::class,
                OpenNavigationRequest::class,
            ],
        );
    }
}
