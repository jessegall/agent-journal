<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Actors\ActorRunner;
use App\Contracts\Admission\StackAdmission;
use App\Contracts\Bus\GuardedCommandBus;
use App\Contracts\Events\Listener;
use App\Enums\CommandEntry;
use App\Enums\CommandOriginStatus;
use App\Events\StateCommandAnswered;
use App\Exceptions\StateAnswerRefused;
use App\Models\Agents\AgentStackRow;
use App\Support\CommandRegistry;
use App\Support\OperationDeadline;
use Psr\Log\LoggerInterface;

/**
 * Runs a command a state answered a hook or a moment of its frame's life with, once the change committed, while the
 * agent's stack is still open; a command that is refused or finds the stack closed is logged and not retried.
 */
final readonly class RunStateCommand implements Listener
{
    public function __construct(
        private GuardedCommandBus $bus,
        private StackAdmission $admission,
        private OperationDeadline $deadline,
        private CommandRegistry $commands,
        private ActorRunner $actors,
        private LoggerInterface $log,
    ) {}

    public function handle(StateCommandAnswered $answered): void
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
            $this->log->info('A command a state answered with was skipped.', [
                'command' => $command::class,
                'target' => $answered->target->description(),
                'outcome' => $status->value,
            ]);
        }
    }
}
