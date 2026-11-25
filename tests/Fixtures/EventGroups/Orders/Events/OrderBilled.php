<?php

declare(strict_types=1);

namespace Tests\Fixtures\EventGroups\Orders\Events;

use Tests\Fixtures\EventGroups\Billing\Events\BillingEvent;

/**
 * An event that implements the base of another domain.
 */
final readonly class OrderBilled implements BillingEvent {}
