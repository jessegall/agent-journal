<?php

declare(strict_types=1);

namespace Tests\Support\Bus;

use App\Contracts\Bus\CommandEnd;
use App\Contracts\Bus\RequestKey;
use App\Support\CommandCall;
use App\Support\CommandSubjects;
use Closure;

/**
 * The end of the bus in a test that sinks commands: it authorizes the subject as the handler's hand-over does, so a
 * refused subject still throws, records the command and gives back the reply arranged for its class, running no
 * handler.
 */
final class CommandSink implements CommandEnd
{
    /**
     * @var list<SunkCommand>
     */
    private array $sunk = [];

    /**
     * @var array<class-string, mixed>
     */
    private array $replies = [];

    public function __construct(private readonly CommandSubjects $subjects, private readonly RequestKey $requestKey) {}

    public function finish(CommandCall $call, Closure $handler): mixed
    {
        $this->subjects->authorized($call);
        $this->sunk[] = new SunkCommand($call->command(), $call->trail(), $call->actorText(), $this->requestKey->key());

        return $this->replies[$call->name()] ?? null;
    }

    /**
     * @param  class-string  $command
     */
    public function reply(string $command, mixed $reply): void
    {
        $this->replies[$command] = $reply;
    }

    /**
     * @return list<SunkCommand>
     */
    public function sunk(): array
    {
        return $this->sunk;
    }
}
