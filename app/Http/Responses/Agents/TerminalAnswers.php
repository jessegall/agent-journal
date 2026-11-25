<?php

declare(strict_types=1);

namespace App\Http\Responses\Agents;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Bus\Command;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Time\ServerClock;
use App\Enums\Engine\RefusalCode;
use App\Support\ActorIdentity;
use App\Support\TerminalControls;
use App\Support\TerminalViewCloser;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Spatie\LaravelData\Data;

/**
 * Answers the terminal's JSON actions: the command's or the read's data, no content for a command that returns none,
 * or a refusal as its code and message with the code's status. No answer is cached.
 */
final readonly class TerminalAnswers
{
    public function __construct(
        private CommandBus $commands,
        private CurrentActor $actors,
        private TerminalControls $controls,
        private TerminalViewCloser $views,
        private ServerClock $clock,
    ) {}

    /**
     * @param  Command<mixed>  $command
     */
    public function run(Command $command): JsonResponse|Response
    {
        return $this->answer(fn () => $this->commands->run($command));
    }

    /**
     * Runs a control command and answers the caller's control of the grant it left.
     *
     * @param  Command<string>  $command
     */
    public function control(Command $command): JsonResponse|Response
    {
        return $this->answer(fn () => $this->controls->answerFor(
            ActorIdentity::of($this->actors->actor()),
            $this->commands->run($command),
            $this->clock->now(),
        ));
    }

    /**
     * Runs an open or renewal and answers the caller's read interest as it left it.
     *
     * @param  Command<string>  $command
     */
    public function interest(Command $command): JsonResponse|Response
    {
        return $this->answer(fn () => $this->views->answerFor(
            ActorIdentity::of($this->actors->actor()),
            $this->commands->run($command),
            $this->clock->now(),
        ));
    }

    /**
     * @param  Closure(): mixed  $read
     */
    public function answer(Closure $read): JsonResponse|Response
    {
        try {
            $data = $read();
        } catch (CommandRefusal $refusal) {
            $code = RefusalCode::of($refusal);

            return $this->uncached(
                new JsonResponse([
                    'code' => $code->value,
                    'message' => $refusal->getMessage(),
                ], $code->status()),
            );
        }

        if (! $data instanceof Data) {
            return $this->uncached(new Response(status: 204));
        }

        return $this->uncached(new JsonResponse($data->toArray()));
    }

    private function uncached(JsonResponse|Response $response): JsonResponse|Response
    {
        $response->headers->set('Cache-Control', 'no-store');

        return $response;
    }
}
