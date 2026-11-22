<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\PipelineDefinition;
use App\Pipes\KeepNavigationAnswer;
use App\Pipes\OpenNavigationRequest;
use App\Pipes\ReplayMenuEntry;
use App\Pipes\RespectNavigationHold;
use App\Pipes\WaitForOpenNavigation;
use App\Support\NavigationRaiseAnswer;
use App\Support\Step;

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
