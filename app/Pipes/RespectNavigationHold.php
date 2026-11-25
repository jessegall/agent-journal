<?php

declare(strict_types=1);

namespace App\Pipes;

use App\Contracts\Bus\Pipe;
use App\Enums\Navigation\NavigationAnswerer;
use App\Support\NavigationRaiseAnswer;
use App\Values\NavigationAdmission;

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
