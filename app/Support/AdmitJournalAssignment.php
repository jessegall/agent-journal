<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Assignments\AssigneeLocks;
use App\Contracts\Assignments\AssignmentProviders;

final readonly class AdmitJournalAssignment
{
    public function __construct(private AssignmentProviders $providers, private AssigneeLocks $locks) {}

    public function admit(JournalAssignment $assignment, AssignmentReference|null $current = null): AdmittedAssignment
    {
        $provider = $this->providers->journalProvider($assignment->record->type);
        $holder = $assignment->recipient;
        $this->locks->lockShared($current === null ? [$holder] : [
            $holder,
            $current->holder,
        ]);
        $this->providers->assigneeProvider($holder->type)->requireEligible($holder);
        $provider->requireJournalAssignment($assignment);

        return new AdmittedAssignment($assignment->record, $holder, $holder);
    }
}
