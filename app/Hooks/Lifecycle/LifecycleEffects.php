<?php

declare(strict_types=1);

namespace App\Hooks\Lifecycle;

use App\Bus\Contracts\GuardedCommandBus;
use App\Bus\Contracts\StackAdmission;
use App\Bus\Enums\CommandEntry;
use App\Bus\Enums\CommandOriginStatus;
use App\Bus\Support\CommandRegistry;
use App\Bus\Support\OperationDeadline;
use App\Hooks\Exceptions\LifecycleCommandRefused;
use App\Hooks\Models\AgentStackRow;
use Psr\Log\LoggerInterface;

/**
 * Runs the lifecycle answers of a committed stack change, in order, each command under its engine-issued origin and
 * in the stack's admitted scope. Once the stack is closed or a command is refused, that answer and every later one
 * are skipped and the outcome is logged with its stage: nothing is retried or queued.
 */
final readonly class LifecycleEffects
{
    public function __construct(
        private GuardedCommandBus $bus,
        private StackAdmission $admission,
        private OperationDeadline $deadline,
        private LifecycleOrigins $origins,
        private CommandRegistry $commands,
        private LoggerInterface $log,
    ) {}

    /**
     * @param  list<LifecycleAnswer>  $answers
     */
    public function apply(array $answers): void
    {
        foreach ($answers as $answer) {
            $status = $this->applyAnswer($answer);

            if ($status !== CommandOriginStatus::Eligible) {
                $this->log->info('A lifecycle answer was skipped.', [
                    'origin' => $answer->origin->description(),
                    'transition' => $answer->origin->transitionId,
                    'ordinal' => $answer->origin->ordinal,
                    'outcome' => $status->value,
                ]);

                return;
            }
        }
    }

    private function applyAnswer(LifecycleAnswer $answer): CommandOriginStatus
    {
        $origin = $answer->origin;

        foreach ($answer->commands->commands as $command) {
            if ($this->commands->entryOf($command::class) !== CommandEntry::Application) {
                $refusal = LifecycleCommandRefused::maintenance($command::class, $origin->description());
                $this->log->warning($refusal->getMessage(), ['transition' => $origin->transitionId]);

                return CommandOriginStatus::Stale;
            }

            $status = $this->admission->admit(
                $origin->target->sessionId,
                $this->deadline,
                fn () => $this->origins->within(
                    $origin,
                    fn () => $this->bus->runGuarded($command, fn () => self::stackStatus($origin)),
                ),
            );

            if ($status !== CommandOriginStatus::Eligible) {
                return $status;
            }
        }

        return CommandOriginStatus::Eligible;
    }

    private static function stackStatus(LifecycleOrigin $origin): CommandOriginStatus
    {
        return AgentStackRow::activeFor($origin->target)->isDefined()
            ? CommandOriginStatus::Eligible
            : CommandOriginStatus::TargetUnavailable;
    }
}
