<?php

declare(strict_types=1);

namespace App\Hooks\StateEvents;

use App\Actors\Contracts\ActorRunner;
use App\Agents\Contracts\AgentCallContext;
use App\Bus\Contracts\GuardedCommandBus;
use App\Bus\Contracts\StackAdmission;
use App\Bus\Enums\CommandEntry;
use App\Bus\Enums\CommandOriginStatus;
use App\Bus\Support\CommandEntrance;
use App\Bus\Support\OperationDeadline;
use App\Hooks\Contracts\EngineTargetAccess;
use Closure;
use Psr\Log\LoggerInterface;

/**
 * Runs returned effects in order, using the original caller's authority and the normal command bus.
 */
final readonly class StateEventEffects
{
    public function __construct(
        private GuardedCommandBus $bus,
        private StateEventOriginGuard $guard,
        private StackAdmission $admission,
        private OperationDeadline $deadline,
        private ActorRunner $actors,
        private AgentCallContext $session,
        private EngineTargetAccess $engine,
        private CommandEntrance $entrance,
        private LoggerInterface $log,
    ) {}

    public function apply(StateEventDispatch $dispatch, StateEventResults $results): void
    {
        foreach ($results->all as $result) {
            $origin = new StateEventOrigin($dispatch, $results->target, $result);
            $status = $this->applyOrigin($origin);

            if ($status === CommandOriginStatus::TargetUnavailable) {
                return;
            }
        }
    }

    private function applyOrigin(StateEventOrigin $origin): CommandOriginStatus
    {
        $audience = $origin->dispatch->audience->get();

        foreach ($origin->commands() as $command) {
            $effect = fn () => $this->bus->runGuarded($command, fn () => $this->guard->check($origin));
            $status = $this->admission->admit(
                $origin->target->sessionId,
                $this->deadline,
                fn () => $this->withCaller($audience, $effect),
            );

            if ($status === CommandOriginStatus::Eligible) {
                continue;
            }

            $origin->logDrop($this->log, $status);

            return $status;
        }

        return CommandOriginStatus::Eligible;
    }

    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    private function withCaller(StateEventAudience $audience, Closure $work): mixed
    {
        $run = fn () => $this->actors->within(
            $audience->actor,
            $audience->authority,
            fn () => $this->session->within($audience->session, $work),
        );

        if ($audience->engineFrame->isEmpty()) {
            return $run();
        }

        return $this->engine->withinFrameGrant(
            $audience->engineFrame->get(),
            fn () => $this->entrance->through(CommandEntry::Application, $run),
        );
    }
}
