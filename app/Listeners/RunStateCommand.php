<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Access\Contracts\StackAdmission;
use App\Accounts\Enums\CommandEntry;
use App\Actors\Contracts\ActorRunner;
use App\Bus\Contracts\GuardedCommandBus;
use App\Bus\RequestKey;
use App\Contracts\Events\Listener;
use App\Engine\Enums\CommandOriginStatus;
use App\Events\Hooks\StateCommandAnswered;
use App\Models\Agents\AgentStackRow;
use App\Stacks\Exceptions\StateAnswerRefused;
use App\Support\CommandRegistry;
use App\Support\OperationDeadline;
use Psr\Log\LoggerInterface;

/**
 * Runs a command a state answered a hook or a moment of its frame's life with, once the change committed, while the
 * agent's stack is still open; a command that is refused or finds the stack closed is logged and not retried. A command
 * that runs only under a request key runs under one made from the answer itself, so a replayed answer finds its receipt.
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
        private RequestKey $requestKey,
    ) {}

    public function handle(StateCommandAnswered $answered): void
    {
        $command = $answered->command;

        if ($this->commands->entryOf($command::class) !== CommandEntry::Application) {
            throw StateAnswerRefused::notApplicationCommand($command::class);
        }

        $run = fn () => $this->actors->within($answered->actor, $answered->authority, fn () => $this->admission->admit(
            $answered->target->sessionId,
            $this->deadline,
            fn () => $this->bus->runGuarded($command, fn () => AgentStackRow::findActiveFor(
                $answered->target,
            )->isDefined()
                ? CommandOriginStatus::Eligible
                : CommandOriginStatus::TargetUnavailable),
        ));

        $status = $this->commands->requiresRequestKey($command::class)
            ? $this->requestKey->independently($this->keyOf($answered), $run)
            : $run();

        if ($status !== CommandOriginStatus::Eligible) {
            $this->log->info('A command a state answered with was skipped.', [
                'command' => $command::class,
                'target' => $answered->target->description(),
                'outcome' => $status->value,
            ]);
        }
    }

    /**
     * The same answer of the same stack always makes the same key.
     */
    private function keyOf(StateCommandAnswered $answered): string
    {
        return 'state-'.substr(hash('sha256', $answered->target->description().serialize($answered->command)), 0, 40);
    }
}
