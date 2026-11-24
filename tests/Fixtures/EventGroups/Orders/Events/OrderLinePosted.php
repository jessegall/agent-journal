<?php

declare(strict_types=1);

namespace Tests\Fixtures\EventGroups\Orders\Events;

/**
 * An order line event that shares its stem with another and no group.
 */
final readonly class OrderLinePosted extends OrderEvent {}
