<?php

declare(strict_types=1);

namespace App\Support;

use App\Exceptions\ServerOriginInvalid;
use App\Values\InstallTicket;

/**
 * The one line the owner pastes in a project folder: curl fetches the script for the ticket from this server's
 * canonical origin and pipes it into sh.
 */
final readonly class InstallLine
{
    public function __construct(private ServerOrigin $origin) {}

    /**
     * @throws ServerOriginInvalid
     */
    public function for(InstallTicket $ticket): string
    {
        return "curl -fsSL {$this->origin->canonical()}/install/{$ticket->secret} | sh";
    }
}
