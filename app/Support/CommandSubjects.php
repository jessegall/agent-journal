<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Authorization\CurrentAuthorizer;
use App\Contracts\Bus\Command;
use App\Contracts\Bus\RecordCommand;
use App\Exceptions\ActorNotAllowed;
use Closure;
use Illuminate\Container\Attributes\Scoped;

/**
 * Authorizes a declared command on its subject inside the command's transaction, and hands that same subject to its
 * handler. A subject is resolved once per attempt, so a retried attempt resolves and authorizes again, and a command a
 * middleware replaced after it was authorized is authorized again before its handler.
 */
#[Scoped]
final class CommandSubjects
{
    /**
     * The subjects handed to handlers running now, innermost last.
     *
     * @var list<array{Command<mixed>, object|string}>
     */
    private array $handedOver = [];

    public function __construct(
        private readonly CommandRegistry $registry,
        private readonly CurrentAuthorizer $authorizer,
    ) {}

    /**
     * The call authorized once on its one subject: a record command's locked record, otherwise its policy's model
     * class. A trusted command, which declares no Authorize, passes as it is.
     *
     * @throws ActorNotAllowed
     */
    public function authorized(CommandCall $call): CommandCall
    {
        $authorize = $this->registry->authorizeOf($call->name());

        if ($authorize === null) {
            return $call;
        }

        $command = $call->command();
        $subject = $command instanceof RecordCommand ? $command->subject() : $authorize->policy::model();
        $this->authorizer->authorize($authorize->policy, $subject, $authorize->access);

        return $call->authorizedOn($subject);
    }

    /**
     * Runs the handler step with the call's authorized subject held for its handler.
     *
     * @param  Closure(Command<mixed>): mixed  $next
     *
     * @throws ActorNotAllowed
     */
    public function handOver(CommandCall $call, Closure $next): mixed
    {
        $authorized = $call->authorizedSubject() === [] ? $this->authorized($call) : $call;
        // A class subject was authorized on the class alone; the handler takes only its command.
        $subjects = array_values(array_filter($authorized->authorizedSubject(), is_object(...)));

        foreach ($subjects as $subject) {
            $this->handedOver[] = [$authorized->command(), $subject];
        }

        try {
            return $next($authorized->command());
        } finally {
            if ($subjects !== []) {
                array_pop($this->handedOver);
            }
        }
    }

    /**
     * The subject held for the command's handler; none for an undeclared command.
     *
     * @param  Command<mixed>  $command
     * @return list<object|string>
     */
    public function subjectFor(Command $command): array
    {
        $held = $this->handedOver[array_key_last($this->handedOver) ?? -1] ?? null;

        return $held !== null && $held[0] === $command ? [$held[1]] : [];
    }
}
