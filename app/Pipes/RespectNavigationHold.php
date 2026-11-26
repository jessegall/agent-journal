<?php

declare(strict_types=1);

namespace App\Pipes;

use App\Contracts\Bus\Pipe;
use App\Enums\Navigation\NavigationHandler;
use App\Support\NavigationRaiseAnswer;
use App\Values\NavigationAdmission;

/**
 * Leaves a runtime held if the user answers its navigation.
 */
final readonly class RespectNavigationHold implements Pipe
{
    public function handle(NavigationAdmission $raise): NavigationRaiseAnswer|NavigationAdmission
    {
        if ($raise->dispatch->handlerFor($raise->runtime) === NavigationHandler::User) {
            return NavigationRaiseAnswer::held();
        }

        return $raise;
    }
}
