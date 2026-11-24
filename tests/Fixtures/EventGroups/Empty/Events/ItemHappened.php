<?php

declare(strict_types=1);

namespace Tests\Fixtures\EventGroups\Empty\Events;

use App\Contracts\Events\Event;

/**
 * The only event of a fixture domain that has no base.
 */
final readonly class ItemHappened implements Event {}
