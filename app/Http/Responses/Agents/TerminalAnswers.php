<?php

declare(strict_types=1);

namespace App\Http\Responses\Agents;

use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Bus\Enums\RefusalCode;
use App\Contracts\CommandRefusal;
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
    public function __construct(private CommandBus $commands) {}

    /**
     * @param  Command<mixed>  $command
     */
    public function run(Command $command): JsonResponse|Response
    {
        return $this->answer(fn (): mixed => $this->commands->run($command));
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

            return $this->uncached(new JsonResponse(['code' => $code->value, 'message' => $refusal->getMessage()], $code->status()));
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
