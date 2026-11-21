<?php

declare(strict_types=1);

namespace App\Connections\Support;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Agents\Support\StartRemedy;
use App\Connections\Models\ProjectInvitation;
use App\Connections\Policies\ConnectionsPolicy;
use App\Operations\Enums\AccessType;

/**
 * The words of a refused start's next step for whoever reads it: an actor who may connect hosts reads the operator's
 * instruction, every other member reads it as a request to ask their host operator.
 */
final readonly class StartRemedyWords
{
    public function __construct(private CurrentAuthorizer $authorizer) {}

    public function textOf(StartRemedy $remedy): string
    {
        return $this->operatesHosts() ? $remedy->operatorText() : $remedy->memberText();
    }

    private function operatesHosts(): bool
    {
        $granted = $this->authorizer->filterActions(
            ConnectionsPolicy::class,
            ProjectInvitation::class,
            [AccessType::Create],
        );

        return $granted !== [];
    }
}
