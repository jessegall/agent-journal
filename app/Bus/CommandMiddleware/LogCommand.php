<?php

declare(strict_types=1);

namespace App\Bus\CommandMiddleware;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Support\CommandAuthorization;
use App\Bus\Support\CommandCall;
use App\Bus\Support\CommandRegistry;
use App\Bus\Support\RequestKey;
use App\Contracts\CommandRefusal;
use App\Reads\Support\ScopedReadMeter;
use App\Reads\Values\ReadCounts;
use Closure;
use Psr\Log\LoggerInterface;
use Throwable;

/**
 * Logs one line per command: its name, owner, actor, the models it loaded and queries it ran, every retry included,
 * and how it ended. A refused authorization is also audited, after the rollback, with the authority it was refused
 * under and the request key. Never a field of the command, since a message body or a rule's text is private.
 */
final readonly class LogCommand implements CommandMiddleware
{
    public function __construct(
        private LoggerInterface $log,
        private ScopedReadMeter $meter,
        private CommandRegistry $registry,
        private CurrentActor $actors,
        private RequestKey $key,
    ) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        $this->meter->begin();

        try {
            $commandReply = $next($call);
        } catch (ActorNotAllowed $refusal) {
            $this->write($call, $this->meter->end(), 'refused: '.class_basename($refusal));
            $this->audit($call, $refusal);

            throw $refusal;
        } catch (Throwable $failure) {
            $this->write(
                $call,
                $this->meter->end(),
                $failure instanceof CommandRefusal
                    ? 'refused: '.class_basename($failure)
                    : 'failed: '.class_basename($failure),
            );

            throw $failure;
        }

        $this->write($call, $this->meter->end(), 'done');

        return $commandReply;
    }

    private function write(CommandCall $call, ReadCounts $counts, string $outcome): void
    {
        $this->log->info('Command '.class_basename($call->name()).' '.$outcome, [
            'command' => $call->name(),
            'owner' => $call->owner(),
            'actor' => $call->actorText(),
            'models_loaded' => $counts->modelsLoaded,
            'queries_run' => $counts->queriesRun,
            'outcome' => $outcome,
        ]);
    }

    /**
     * Who was refused what, under which authority and request; never the subject's content, a credential or a
     * signature.
     */
    private function audit(CommandCall $call, ActorNotAllowed $refusal): void
    {
        $authorization = $this->registry->authorizationOf($call->name());

        $this->log->warning('Authorization refused for '.class_basename($call->name()), [
            'command' => $call->name(),
            'actor' => $call->actorText(),
            ...$authorization->map(fn (CommandAuthorization $declared) => $declared->auditFields())->getOrElse([]),
            'authority' => $this->actors->authority()->description(),
            'request_key' => $this->key->keyOfCurrentCommand(),
            'refusal' => $refusal->getMessage(),
        ]);
    }
}
