<?php

declare(strict_types=1);

namespace Tests\Fixtures\EventGroups\Orders\Events;

use Tests\Fixtures\EventGroups\Billing\Events\BillingEvent;

/**
 * An event that extends the base of another domain.
 */
final readonly class OrderBilled extends BillingEvent {}
