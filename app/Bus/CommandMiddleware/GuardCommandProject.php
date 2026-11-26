<?php

declare(strict_types=1);

namespace App\Bus\CommandMiddleware;

use App\Access\OwnerAuthorizerProvider;
use App\Actors\Contracts\CurrentActor;
use App\Bus\CommandCall;
use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Exceptions\CrossProjectWrite;
use App\Exceptions\ModelMissing;
use App\Models\Projects\Project;
use App\Projects\Contracts\CurrentProject;
use App\Projects\Contracts\ProjectCommand;
use App\Projects\Enums\ProjectSelectionType;
use App\Values\ProjectOwner;
use App\Values\ProjectSelection;
use Closure;

/**
 * Refuses a command that writes a project's record outside the sender's selection: one project writes only there,
 * Global only for the owner; All writes any existing project or Global; None writes nothing.
 */
final readonly class GuardCommandProject implements CommandMiddleware
{
    public function __construct(
        private CurrentProject $projects,
        private CurrentActor $actors,
        private OwnerAuthorizerProvider $owners,
    ) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        $command = $call->original();

        if ($command instanceof ProjectCommand) {
            $this->assertWritable($this->projects->selection(), $command->owner());
        }

        return $next($call);
    }

    /**
     * @throws CrossProjectWrite
     * @throws ModelMissing when the owner names a project that does not exist
     */
    private function assertWritable(ProjectSelection $selection, ProjectOwner $owner): void
    {
        if ($selection->type === ProjectSelectionType::None) {
            throw CrossProjectWrite::forOwner();
        }

        if ($owner->isGlobal()) {
            $this->assertGlobalWritable($selection);

            return;
        }

        if ($selection->type === ProjectSelectionType::All) {
            Project::findForId($owner->projectId());

            return;
        }

        if ($owner->projectId() !== $selection->projectId()) {
            throw CrossProjectWrite::forOwner();
        }
    }

    /**
     * @throws CrossProjectWrite
     */
    private function assertGlobalWritable(ProjectSelection $selection): void
    {
        if ($selection->type === ProjectSelectionType::All) {
            return;
        }

        $actor = $this->actors->actor();

        if (! $actor->isUser() || ! $this->owners->isOwner($actor)) {
            throw CrossProjectWrite::forOwner();
        }
    }
}
