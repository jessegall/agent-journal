<?php

declare(strict_types=1);

namespace App\Commands\Agents\ClaimStart;

use App\Contracts\Bus\CommandHandler;
use App\Exceptions\StartClaimRefused;
use App\Support\ClaimedStart;
use App\Support\StartClaims;

/**
 * Hands the host a pending start of a runtime assigned to it, as StartClaims takes it.
 */
final readonly class ClaimStartHandler implements CommandHandler
{
    public function __construct(private StartClaims $claims) {}

    /**
     * @throws StartClaimRefused
     */
    public function handle(ClaimStartCommand $command): ClaimedStart|null
    {
        return $this->claims->claim($command->hostId, $command->sessionId);
    }
}
