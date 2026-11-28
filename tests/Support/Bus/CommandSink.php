<?php

declare(strict_types=1);

namespace Tests\Support\Bus;

use App\Bus\CommandCall;
use App\Bus\CommandSubjects;
use App\Bus\Contracts\CommandEnd;
use App\Bus\Contracts\RequestKey;
use App\Support\CommandRegistry;
use App\Support\DeclaredType;
use App\Support\Reflector;
use Closure;
use PhpOption\Option;
use Stringable;
use Tests\Support\Bus\Exceptions\SunkReplyRefused;

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

    public function __construct(
        private readonly CommandSubjects $subjects,
        private readonly RequestKey $requestKey,
        private readonly CommandRegistry $registry,
    ) {}

    public function finish(CommandCall $call, Closure $handler): mixed
    {
        $this->subjects->authorized($call);
        $this->sunk[] = new SunkCommand($call->command(), $call->passedMiddleware(), $call->actorText(), $this->requestKey->key());

        if (array_key_exists($call->name(), $this->replies)) {
            return $this->replies[$call->name()];
        }

        foreach ($this->returnTypeOf($call->name()) as $type) {
            if (! $type->isVoid() && ! $type->accepts(null)) {
                throw SunkReplyRefused::missing($call->name(), $type->text);
            }
        }

        return null;
    }

    /**
     * The reply each command of the class is given, which its handler could have returned; a Stringable reply to a
     * handler that returns a string is given as that string.
     *
     * @param  class-string  $command
     */
    public function reply(string $command, mixed $reply): void
    {
        $this->replies[$command] = $this->returnTypeOf($command)->map(
            fn (DeclaredType $type) => $this->replyOfType($command, $type, $reply),
        )->getOrElse($reply);
    }

    /**
     * @return list<SunkCommand>
     */
    public function sunk(): array
    {
        return $this->sunk;
    }

    /**
     * @return Option<DeclaredType>
     */
    private function returnTypeOf(string $command): Option
    {
        return Reflector::of($this->registry->handlerOf($command))->method('handle')->returnType();
    }

    private function replyOfType(string $command, DeclaredType $type, mixed $reply): mixed
    {
        if ($type->isVoid()) {
            throw SunkReplyRefused::forVoid($command);
        }

        if ($reply instanceof Stringable && ! $type->accepts($reply) && $type->accepts((string) $reply)) {
            return (string) $reply;
        }

        if (! $type->accepts($reply)) {
            throw SunkReplyRefused::ofAnotherType($command, $type->text, get_debug_type($reply));
        }

        return $reply;
    }
}
