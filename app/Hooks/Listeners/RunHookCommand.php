<?php

declare(strict_types=1);

namespace App\Hooks\Listeners;

use App\Actors\Contracts\ActorRunner;
use App\Bus\Contracts\GuardedCommandBus;
use App\Bus\Contracts\StackAdmission;
use App\Bus\Enums\CommandEntry;
use App\Bus\Enums\CommandOriginStatus;
use App\Bus\Support\CommandRegistry;
use App\Bus\Support\OperationDeadline;
use App\Contracts\Listener;
use App\Hooks\Events\HookCommandAnswered;
use App\Hooks\Exceptions\StateAnswerRefused;
use App\Hooks\Models\AgentStackRow;
use Psr\Log\LoggerInterface;

/**
 * Runs a command a state answered a hook with, once the hook committed, while the agent's stack is still open; a
 * command that is refused or finds the stack closed is logged and not retried.
 */
final readonly class RunHookCommand implements Listener
{
    public function __construct(
        private GuardedCommandBus $bus,
        private StackAdmission $admission,
        private OperationDeadline $deadline,
        private CommandRegistry $commands,
        private ActorRunner $actors,
        private LoggerInterface $log,
    ) {}

    public function handle(HookCommandAnswered $answered): void
    {
        $command = $answered->command;

        if ($this->commands->entryOf($command::class) !== CommandEntry::Application) {
            throw StateAnswerRefused::notApplicationCommand($command::class);
        }

        $status = $this->actors->within($answered->actor, $answered->authority, fn () => $this->admission->admit(
            $answered->target->sessionId,
            $this->deadline,
            fn () => $this->bus->runGuarded($command, fn () => AgentStackRow::activeFor($answered->target)->isDefined()
                ? CommandOriginStatus::Eligible
                : CommandOriginStatus::TargetUnavailable),
        ));

        if ($status !== CommandOriginStatus::Eligible) {
            $this->log->info('A command a state answered a hook with was skipped.', [
                'command' => $command::class,
                'target' => $answered->target->description(),
                'outcome' => $status->value,
            ]);
        }
    }
}
