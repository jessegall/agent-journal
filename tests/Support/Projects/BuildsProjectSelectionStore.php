<?php

declare(strict_types=1);

namespace Tests\Support\Projects;

use App\Contracts\Admission\JournalAdmission;
use App\Contracts\Inboxes\InboxEligibility;
use App\Contracts\Inboxes\InboxMemberPolicies;
use App\Contracts\Projects\AgentProjects;
use App\Support\Access\OwnerAuthorizerProvider;
use App\Support\ActorStore;
use App\Support\Projects\ProjectSelectionStore;

/**
 * For a unit test: the project selection store over the test's own actors, agent projects and admission.
 */
trait BuildsProjectSelectionStore
{
    private function projectSelectionStore(
        ActorStore $actors,
        AgentProjects $agents,
        JournalAdmission $admission,
    ): ProjectSelectionStore {
        return new ProjectSelectionStore(
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
