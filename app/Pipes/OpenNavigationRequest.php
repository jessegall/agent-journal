<?php

declare(strict_types=1);

namespace App\Pipes;

use App\Contracts\Bus\Pipe;
use App\Enums\Drivers\HoldReason;
use App\Models\Drivers\NavigationRequest;
use App\Support\NavigationRaiseAnswer;
use App\Values\NavigationAdmission;
use App\Values\ScriptProgress;
use Carbon\CarbonImmutable;
use Illuminate\Container\Attributes\Config;

/**
 * Opens a request, holds its runtime and delivers it to the main desk.
 */
final readonly class OpenNavigationRequest implements Pipe
{
    public function __construct(
        #[Config('agents.navigation.expire_minutes')]
        private int $expireMinutes,
    ) {}

    public function handle(NavigationAdmission $raise): NavigationRaiseAnswer
    {
        $uncertainty = $raise->command->uncertainty;

        $raise->request->recordScriptProgress(
            new ScriptProgress($uncertainty->stalledStep, $uncertainty->screen->generation, 'navigation requested'),
        );

        $navigation = NavigationRequest::create(
            $raise->request,
            $raise->owner,
            $uncertainty,
            $raise->command->operationKey,
            CarbonImmutable::now()->addMinutes($this->expireMinutes),
        );

        $raise->runtime->holdFor(HoldReason::NavigationNeeded);
        $raise->request->hold(HoldReason::NavigationNeeded);
        $raise->dispatch->deliver($navigation, 0);

        return NavigationRaiseAnswer::opened($navigation->id);
    }
}
