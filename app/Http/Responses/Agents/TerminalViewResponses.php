<?php

declare(strict_types=1);

namespace App\Http\Responses\Agents;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\ServerClock;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\TerminalViewCloser;
use App\Agents\Exceptions\TerminalViewRefused;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use Closure;
use Symfony\Component\HttpFoundation\Response;

/**
 * Answers a viewer's work on an agent's terminal; a viewer who may not inspect the agent loses their views of it and
 * gets the same refusal as for an unknown agent, which renders itself.
 */
final readonly class TerminalViewResponses
{
    public function __construct(
        private CommandBus $commands,
        private CurrentActor $actor,
        private TerminalViewCloser $views,
        private ServerClock $clock,
    ) {}

    /**
     * Runs a command about the agent's terminal and answers its result.
     *
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @param  Closure(TResult): Response  $answer
     */
    public function run(string $agentId, Command $command, Closure $answer): Response
    {
        return $this->answer($agentId, fn (): Response => $answer($this->commands->run($command)));
    }

    /**
     * @param  Closure(): Response  $work
     *
     * @throws TerminalViewRefused
     */
    public function answer(string $agentId, Closure $work): Response
    {
        try {
            return $work();
        } catch (ActorNotAllowed $cause) {
            $this->views->closeAllFor($agentId, ActorIdentity::of($this->actor->actor()), $this->clock->now());

            throw TerminalViewRefused::mayNotInspect($cause);
        }
    }
}
