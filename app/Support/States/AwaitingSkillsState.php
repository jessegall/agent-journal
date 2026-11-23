<?php

declare(strict_types=1);

namespace App\Support\States;

use App\Enums\PublicationState;
use App\Support\Decisions\Decision;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\ShellCommandRequested;
use App\Values\RecoveryCall;
use App\Values\StackVerdict;
use PhpOption\Option;
use PhpOption\Some;

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

    public function workPermission(): StackVerdict
    {
        return StackVerdict::refuse($this->reason(), new RecoveryCall('overview_read'));
    }

    public function onShellCommand(ShellCommandRequested $input): Decision
    {
        if ($input->command->readsOnly()) {
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
            'Your journal skill set is %s, not delivered yet, so file changes wait. Reading still works: '
            .'php artisan skill:status shows where it stands and php artisan skill:show <key> prints a skill.',
            $this->publication->value,
        );
    }

    /**
     * @return Option<string>
     */
    public function instruction(): Option
    {
        return new Some($this->reason());
    }
}
