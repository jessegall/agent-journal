<?php

declare(strict_types=1);

namespace App\Skills\States;

use App\Bus\Values\RecoveryCall;
use App\Hooks\Attributes\StackWide;
use App\Hooks\Commands\FocusInstruction;
use App\Hooks\Commands\ReleaseInstruction;
use App\Hooks\Contracts\InstructsForeground;
use App\Hooks\Decisions\Decision;
use App\Hooks\Inputs\FileEditRequested;
use App\Hooks\Inputs\ShellCommandRequested;
use App\Hooks\Lifecycle\LifecycleContext;
use App\Hooks\States\AgentState;
use App\Hooks\Values\LifecycleCommands;
use App\Hooks\Values\StackVerdict;
use App\Skills\Enums\PublicationState;

/**
 * A session whose new skill set is not delivered yet: it may read, including skill:status and skill:show, but changes
 * no file until the set is delivered. It ends by itself once the publication settles.
 */
final class AwaitingSkillsState extends AgentState implements InstructsForeground
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

    #[StackWide]
    public function onShellCommand(ShellCommandRequested $input): Decision
    {
        if (! $input->command->mayChangeFiles()) {
            return Decision::delegate();
        }

        return Decision::deny($this->reason());
    }

    #[StackWide]
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

    public function onEnter(LifecycleContext $context): LifecycleCommands
    {
        return LifecycleCommands::of(new FocusInstruction());
    }

    public function onResume(LifecycleContext $context): LifecycleCommands
    {
        return LifecycleCommands::of(new FocusInstruction());
    }

    public function onExit(LifecycleContext $context): LifecycleCommands
    {
        return LifecycleCommands::of(new ReleaseInstruction());
    }

    public function instructionType(): string
    {
        return 'skills.delivery';
    }

    public function instructionText(): string
    {
        return $this->reason();
    }
}
