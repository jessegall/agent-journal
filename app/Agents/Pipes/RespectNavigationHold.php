<?php

declare(strict_types=1);

namespace App\Agents\Pipes;

use App\Agents\Enums\NavigationAnswerer;
use App\Agents\Support\NavigationRaiseAnswer;
use App\Agents\Pipelines\NavigationAdmission;
use App\Pipelines\Contracts\Pipe;

/**
 * Leaves a runtime held if the user answers its navigation.
 */
final readonly class RespectNavigationHold implements Pipe
{
    public function handle(NavigationAdmission $raise): NavigationRaiseAnswer|NavigationAdmission
    {
        if ($raise->dispatch->answererFor($raise->runtime) === NavigationAnswerer::User) {
            return NavigationRaiseAnswer::held();
        }

        return $raise;
    }
}
