<?php

declare(strict_types=1);

namespace App\Navigation\Pipelines;

use App\Bus\Contracts\PipelineDefinition;
use App\Navigation\NavigationRaiseAnswer;
use App\Navigation\Pipes\KeepNavigationAnswer;
use App\Navigation\Pipes\OpenNavigationRequest;
use App\Navigation\Pipes\ReplayMenuEntry;
use App\Navigation\Pipes\RespectNavigationHold;
use App\Navigation\Pipes\WaitForOpenNavigation;
use App\Navigation\Values\NavigationAdmission;
use App\Pipelines\Support\Step;

/**
 * Answers a locked raise with the first admission decision that applies.
 *
 * @implements PipelineDefinition<NavigationAdmission, NavigationRaiseAnswer>
 */
final readonly class ResolveNavigationAdmissionPipeline implements PipelineDefinition
{
    public string $input = NavigationAdmission::class;

    public string $output = NavigationRaiseAnswer::class;

    public function pipes(): array
    {
        return array_map(
            fn (string $pipe) => Step::resolvedBy(
                static fn (
                    NavigationAdmission|NavigationRaiseAnswer $raise,
                ): string => $raise instanceof NavigationAdmission ? $pipe : KeepNavigationAnswer::class,
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
