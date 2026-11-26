<?php

declare(strict_types=1);

namespace App\Navigation\Pipes;

use App\Bus\Contracts\Pipe;
use App\Navigation\Enums\NavigationHandler;
use App\Navigation\NavigationRaiseAnswer;
use App\Navigation\Values\NavigationAdmission;

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
