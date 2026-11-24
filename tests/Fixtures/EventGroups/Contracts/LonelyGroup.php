<?php

declare(strict_types=1);

namespace Tests\Fixtures\EventGroups\Contracts;

use App\Contracts\Events\Event;

/**
 * A group no event joins.
 */
interface LonelyGroup extends Event {}
