<?php

declare(strict_types=1);

namespace App\Pipes;

use App\Contracts\Bus\Pipe;
use App\Enums\NavigationAnswerer;
use App\Pipelines\NavigationAdmission;
use App\Support\NavigationRaiseAnswer;

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
