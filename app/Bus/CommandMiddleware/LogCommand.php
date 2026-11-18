<?php

declare(strict_types=1);

namespace App\Bus\CommandMiddleware;

use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Support\CommandCall;
use App\Contracts\CommandRefusal;
use Closure;
use Psr\Log\LoggerInterface;
use Throwable;

/**
 * Logs one line per command: its name, owner, actor, how long it took and how it ended. Never a field of the
 * command, since a message body or a rule's text is private.
 */
final readonly class LogCommand implements CommandMiddleware
{
    public function __construct(private LoggerInterface $log) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        $started = hrtime(true);

        try {
            $result = $next($call);
            $this->write($call, $started, 'done');

            return $result;
        } catch (Throwable $failure) {
            $this->write($call, $started, $failure instanceof CommandRefusal ? 'refused: '.class_basename($failure) : 'failed: '.class_basename($failure));

            throw $failure;
        }
    }

    private function write(CommandCall $call, int $started, string $outcome): void
    {
        $this->log->info('Command '.class_basename($call->name()).' '.$outcome, [
            'command' => $call->name(),
            'owner' => $call->owner(),
            'actor' => $call->actorText(),
            'milliseconds' => intdiv(hrtime(true) - $started, 1_000_000),
            'outcome' => $outcome,
        ]);
    }
}
