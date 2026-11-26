<?php

declare(strict_types=1);

namespace Tests\Support\Agents;

use App\Models\Access\User;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\NavigationRequest;
use App\Navigation\Enums\NavigationReason;
use App\Support\ActorReference;
use App\Values\NavigationScreen;
use App\Values\NavigationUncertainty;
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

        return DriverRequest::query()->with('runtime')->findOrFail($receipt->requestId);
    }

    private function raise(DriverRequest $stalled, string $operationKey): NavigationRequest
    {
        $uncertainty = new NavigationUncertainty(
            NavigationReason::LabelMissing,
            2,
            'fp1:'.str_repeat('a', 64),
            new NavigationScreen(['Model: GPT-5', '❯ GPT-6'], 1, 7),
        );

        return NavigationRequest::create(
            $stalled,
            ActorReference::ofClass(User::class, 'owner'),
            $uncertainty,
            $operationKey,
            CarbonImmutable::now()->addMinutes(30),
        );
    }
}
