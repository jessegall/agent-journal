<?php

declare(strict_types=1);

namespace App\Contracts\Navigation;

use App\Contracts\Events\Event;

/**
 * A fact that changes what users see on their pages; Web's one listener receives every fact that implements it.
 */
interface ClientUpdate extends Event {}
