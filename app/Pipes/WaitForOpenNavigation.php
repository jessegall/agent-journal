<?php

declare(strict_types=1);

namespace App\Pipes;

use App\Contracts\Bus\Pipe;
use App\Models\Drivers\NavigationRequest;
use App\Values\NavigationAdmission;
use App\Support\NavigationRaiseAnswer;
use Illuminate\Container\Attributes\Config;

/**
 * Waits behind an open request for the same menu on another runtime.
 */
final readonly class WaitForOpenNavigation implements Pipe
{
    public function __construct(
        #[Config('agents.navigation.retry_after_seconds')]
        private int $retryAfterSeconds,
    ) {}

    public function handle(NavigationAdmission $raise): NavigationRaiseAnswer|NavigationAdmission
    {
        if (NavigationRequest::isSameMenuOpenElsewhere(
            $raise->owner,
            $raise->runtime,
            $raise->request->scriptGoal(),
            $raise->fingerprint(),
        )) {
            return NavigationRaiseAnswer::wait($this->retryAfterSeconds);
        }

        return $raise;
    }
}
