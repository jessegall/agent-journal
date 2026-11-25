<?php

declare(strict_types=1);

namespace Domain\Sharing\Contracts;

use App\Contracts\Events\Event;

/**
 * A change of a share gateway configuration: changed or made the default.
 */
interface ShareGatewayEvent extends Event {}
