<?php

declare(strict_types=1);

namespace Tests\Fixtures\EventGroups\Billing\Events;

use App\Contracts\Events\Event;

/**
 * The base of the billing fixture domain's events.
 */
interface BillingEvent extends Event {}
