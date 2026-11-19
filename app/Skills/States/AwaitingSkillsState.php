<?php

declare(strict_types=1);

namespace App\Skills\States;

use App\Hooks\Decisions\Decision;
use App\Hooks\Inputs\FileEditRequested;
use App\Hooks\Inputs\ShellCommandRequested;
use App\Hooks\States\AgentState;
use App\Skills\Enums\PublicationState;

/**
 * A session whose new skill set is not delivered yet: it may read, including skill:status and skill:show, but changes
 * no file until the set is delivered. It ends by itself once the publication settles.
 */
final class AwaitingSkillsState extends AgentState
{
    public function __construct(
        private readonly PublicationState $publication,
    ) {}

    public function isFinished(): bool
    {
        return ! $this->publication->awaitsDelivery();
    }

    public function onShellCommand(ShellCommandRequested $input): Decision
    {
        if (! $input->command->mayChangeFiles()) {
            return Decision::delegate();
        }

        return Decision::deny($this->reason());
    }

    public function onFileEdit(FileEditRequested $input): Decision
    {
        return Decision::deny($this->reason());
    }

    private function reason(): string
    {
        return sprintf(
            'Your journal skill set is %s, not delivered yet, so file changes wait. Reading still works: php artisan skill:status shows where it stands and php artisan skill:show <key> prints a skill.',
            $this->publication->value,
        );
    }
}
