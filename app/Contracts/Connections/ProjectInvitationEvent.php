<?php

declare(strict_types=1);

namespace App\Contracts\Connections;

use App\Contracts\Events\Event;

/**
 * An invitation to connect a project issued, revoked or spent.
 */
interface ProjectInvitationEvent extends Event {}
