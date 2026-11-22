<?php

declare(strict_types=1);

namespace App\CommandMiddleware;

use App\Contracts\CommandMiddleware;
use App\Contracts\CommandRefusal;
use App\Contracts\CurrentActor;
use App\Exceptions\ActorNotAllowed;
use App\Support\CommandCall;
use App\Support\CommandName;
use App\Support\CommandRegistry;
use App\Support\RequestKey;
use App\Support\ScopedReadMeter;
use App\Values\ReadCounts;
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
        $this->log->info('Command '.CommandName::of($call->name()).' '.$outcome, [
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
        $authorize = $this->registry->authorizeOf($call->name());

        $this->log->warning('Authorization refused for '.CommandName::of($call->name()), [
            'command' => $call->name(),
            'actor' => $call->actorText(),
            ...$authorize?->auditFields() ?? [],
            'authority' => $this->actors->authority()->description(),
            'request_key' => $this->key->keyOfCurrentCommand(),
            'refusal' => $refusal->getMessage(),
        ]);
    }
}
