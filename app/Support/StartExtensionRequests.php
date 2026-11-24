<?php

declare(strict_types=1);

namespace App\Support;

use App\Events\Sessions\AccountSettingsRequested;
use App\Events\Sessions\ChildCheckoutRequested;
use App\Events\Sessions\StartGrantRequested;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Asks the areas that extend a start to contribute, at once, inside the claim: the account settings a host needs to
 * start the driver, and the additions its grant carries. Each is a synchronous request, not a fact.
 */
final readonly class StartExtensionRequests
{
    public function __construct(private Dispatcher $events) {}

    public function accountSettings(AccountSettingsRequested $request): void
    {
        $this->events->dispatch($request);
    }

    public function childCheckout(ChildCheckoutRequested $request): void
    {
        $this->events->dispatch($request);
    }

    public function grantAdditions(StartGrantRequested $request): void
    {
        $this->events->dispatch($request);
    }
}
