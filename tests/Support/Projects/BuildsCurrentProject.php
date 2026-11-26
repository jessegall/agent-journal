<?php

declare(strict_types=1);

namespace Tests\Support\Projects;

use App\Access\Contracts\JournalAdmission;
use App\Access\OwnerAuthorizerProvider;
use App\Actors\ActorStore;
use App\Inboxes\Contracts\InboxEligibility;
use App\Inboxes\Contracts\InboxMemberPolicies;
use App\Projects\Contracts\AgentProjects;
use App\Projects\CurrentProject;

/**
 * For a unit test: the project selection store over the test's own actors, agent projects and admission.
 */
trait BuildsCurrentProject
{
    private function currentProject(
        ActorStore $actors,
        AgentProjects $agents,
        JournalAdmission $admission,
    ): CurrentProject {
        return new CurrentProject(
            $actors,
            $agents,
            new OwnerAuthorizerProvider(
                $admission,
                $actors,
                $this->createStub(InboxEligibility::class),
                $this->createStub(InboxMemberPolicies::class),
            ),
        );
    }
}
