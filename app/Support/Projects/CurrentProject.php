<?php

declare(strict_types=1);

namespace App\Support\Projects;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Projects\AgentProjects;
use App\Contracts\Projects\CurrentProject as CurrentProjectContract;
use App\Support\Access\OwnerAuthorizerProvider;
use App\Values\ProjectSelection;
use App\Values\StackTarget;
use Closure;
use Illuminate\Container\Attributes\Scoped;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * The one place this request's project selection is kept and answered, by who acts and by the stack target pinned.
 */
#[Scoped]
final class CurrentProject implements CurrentProjectContract
{
    /**
     * The selection the browser chose, installed by the web middleware.
     *
     * @var Option<ProjectSelection>
     */
    private Option $chosen;

    /**
     * The selection the journal holds while it works for one stack target or walks a share.
     *
     * @var Option<ProjectSelection>
     */
    private Option $pinned;

    /**
     * Each agent's project, read once per request.
     *
     * @var array<string, string>
     */
    private array $agentProjects = [];

    public function __construct(
        private readonly CurrentActor $actors,
        private readonly AgentProjects $agents,
        private readonly OwnerAuthorizerProvider $owners,
    ) {
        $this->chosen = None::create();
        $this->pinned = None::create();
    }

    public function selection(): ProjectSelection
    {
        if ($this->pinned->isDefined()) {
            return $this->pinned->get();
        }

        if (! $this->actors->hasActor()) {
            return ProjectSelection::none();
        }

        $actor = $this->actors->actor();

        if ($actor->isAgent()) {
            return ProjectSelection::of($this->projectIdOf($actor->id));
        }

        if ($actor->isJournal()) {
            return ProjectSelection::all();
        }

        if ($actor->isUser() && $this->owners->isOwner($actor)) {
            return $this->chosen->getOrElse(ProjectSelection::all());
        }

        return ProjectSelection::none();
    }

    /**
     * Installs the browser's choice for the rest of the request; only an owner's reads follow it.
     */
    public function select(ProjectSelection $selection): void
    {
        $this->chosen = new Some($selection);
    }

    /**
     * Runs the work under the target agent's project, such as a state's listener or a tick, whoever acts.
     *
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function forTarget(StackTarget $target, Closure $work): mixed
    {
        return $this->within(ProjectSelection::of($this->projectIdOf($target->agentId)), $work);
    }

    /**
     * Runs the work under the selection and gives the earlier one back afterwards, also when the work throws.
     *
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function within(ProjectSelection $selection, Closure $work): mixed
    {
        $earlier = $this->pinned;
        $this->pinned = new Some($selection);

        try {
            return $work();
        } finally {
            $this->pinned = $earlier;
        }
    }

    private function projectIdOf(string $agentId): string
    {
        if (! array_key_exists($agentId, $this->agentProjects)) {
            $this->agentProjects[$agentId] = $this->agents->projectIdOf($agentId);
        }

        return $this->agentProjects[$agentId];
    }
}
