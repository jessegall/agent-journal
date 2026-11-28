<?php

declare(strict_types=1);

namespace App\Web\Creation;

use App\Access\Contracts\JournalAdmission;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentUserResolver;
use App\Declarations\SlotContext;
use App\Projects\Contracts\CurrentProject;
use App\Records\Contracts\RecordResolver;
use App\Sessions\Contracts\AgentDirectory;
use App\Sessions\Contracts\CurrentSession;
use App\Sessions\Contracts\SessionResolver;
use App\Support\RecordIdentity;
use App\Web\Values\WindowInstance;
use Illuminate\Http\Request;

final readonly class SurfaceContexts
{
    public function __construct(
        private CurrentActor $actors,
        private JournalAdmission $admission,
        private CurrentSession $sessions,
        private CurrentProject $projects,
        private CurrentUserResolver $users,
        private AgentDirectory $agents,
        private SessionResolver $visibleSessions,
        private RecordResolver $records,
    ) {}

    public function forVisit(
        Request $visit,
        WindowInstance|null $window = null,
        SlotContext|null $slot = null,
        RecordIdentity|null $inspector = null,
    ): SurfaceContext {
        return new SurfaceContext(
            $visit,
            $this->actors,
            $this->admission,
            $this->sessions,
            $this->projects,
            $this->users,
            $this->agents,
            $this->visibleSessions,
            $this->records,
            $window,
            $slot,
            $inspector,
        );
    }
}
