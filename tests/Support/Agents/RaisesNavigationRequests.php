<?php

declare(strict_types=1);

namespace Tests\Support\Agents;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Agents\Enums\NavigationReason;
use App\Agents\Models\DriverRequest;
use App\Agents\Models\NavigationRequest;
use App\Agents\Values\NavigationScreen;
use App\Agents\Values\NavigationUncertainty;
use Carbon\CarbonImmutable;

/**
 * Raises a navigation request the way the host does, for a ChangeModel key script on a newly opened runtime that
 * stalled on a model picker, owned by the journal's owner.
 */
trait RaisesNavigationRequests
{
    use OpensLedgerRuntimes;

    /**
     * A ChangeModel key script the host has started on a newly opened runtime.
     */
    private function stalledScript(): DriverRequest
    {
        [, $opened] = $this->openRuntime();
        $receipt = $this->asOwner($this->keyScript($opened, 'ChangeModel', ['model' => 'GPT-6']));

        return DriverRequest::query()->findOrFail($receipt->requestId);
    }

    private function raise(DriverRequest $stalled, string $operationKey): NavigationRequest
    {
        $uncertainty = new NavigationUncertainty(
            NavigationReason::LabelMissing,
            2,
            'fp1:'.str_repeat('a', 64),
            new NavigationScreen(['Model: GPT-5', '❯ GPT-6'], 1, 7),
        );

        return NavigationRequest::raised(
            $stalled,
            new ActorIdentity(ActorType::User, 'owner'),
            $uncertainty,
            $operationKey,
            CarbonImmutable::now()->addMinutes(30),
        );
    }
}
