<?php

declare(strict_types=1);

namespace App\Bus\CommandMiddleware;

use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Support\CommandCall;
use App\Contracts\CommandRefusal;
use App\Reads\Support\ScopedReadMeter;
use App\Reads\Values\ReadCounts;
use Closure;
use Psr\Log\LoggerInterface;
use Throwable;

/**
 * Logs one line per command: its name, owner, actor, the models it loaded and queries it ran, every retry included,
 * and how it ended. Never a field of the command, since a message body or a rule's text is private.
 */
final readonly class LogCommand implements CommandMiddleware
{
    public function __construct(private LoggerInterface $log, private ScopedReadMeter $meter) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        $this->meter->begin();

        try {
            $result = $next($call);
        } catch (Throwable $failure) {
            $this->write($call, $this->meter->end(), $failure instanceof CommandRefusal ? 'refused: '.class_basename($failure) : 'failed: '.class_basename($failure));

            throw $failure;
        }

        $this->write($call, $this->meter->end(), 'done');

        return $result;
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
}
