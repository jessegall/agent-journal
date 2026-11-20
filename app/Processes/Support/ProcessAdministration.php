<?php

declare(strict_types=1);

namespace App\Processes\Support;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Operations\Enums\AccessType;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;

/**
 * Whether the caller administers processes, so it may act on another actor's runs, requests and proposals.
 */
final readonly class ProcessAdministration
{
    public function __construct(private CurrentAuthorizer $authorizer) {}

    public function isGrantedToCaller(): bool
    {
        $granted = $this->authorizer->filterActions(
            ProcessAdministrationPolicy::class,
            CommandRequest::class,
            [AccessType::Edit],
        );

        return $granted !== [];
    }
}
