<?php

declare(strict_types=1);

namespace App\Sessions;

use App\Events\Sessions\AccountSettingsRequested;
use App\Events\Sessions\ChildCheckoutRequested;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Asks the areas that extend a start to contribute, at once, inside the claim: the account settings a host needs to
 * start the driver, and the checkout a child start works in. Each is a synchronous request, not a fact.
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
}
