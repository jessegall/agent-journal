<?php

declare(strict_types=1);

namespace App\Agents\Pipes;

use App\Agents\Models\NavigationRequest;
use App\Agents\Support\NavigationRaiseAnswer;
use App\Agents\Values\NavigationAdmission;
use App\Pipelines\Contracts\Pipe;
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
            $raise->command->uncertainty->fingerprint,
        )) {
            return NavigationRaiseAnswer::wait($this->retryAfterSeconds);
        }

        return $raise;
    }
}
