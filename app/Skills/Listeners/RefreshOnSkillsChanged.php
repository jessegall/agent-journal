<?php

declare(strict_types=1);

namespace App\Skills\Listeners;

use App\Actors\Support\ActorStore;
use App\Bus\Contracts\CommandBus;
use App\Contracts\Listener;
use App\Skills\Commands\RefreshSkills;
use App\Skills\Events\SkillsChanged;

/**
 * After a stored skill changed and its transaction committed, the journal refreshes the catalogue as itself, so the
 * running sessions it applies to get a pending publication. It writes no file.
 */
final readonly class RefreshOnSkillsChanged implements Listener
{
    public function __construct(
        private ActorStore $actors,
        private CommandBus $commands,
    ) {}

    public function handle(SkillsChanged $event): void
    {
        $this->actors->actAsSystem('skill refresh', fn () => $this->commands->run(new RefreshSkills()));
    }
}
