<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Support;

use App\Bus\CommandCall;
use App\Bus\CommandName;
use App\Bus\Contracts\CommandMiddleware;
use Closure;
use Illuminate\Database\ConnectionInterface;

/**
 * Writes an audit row for each command it watches inside the command's transaction, and adds its own line to the step log.
 */
abstract readonly class AuditCommands implements CommandMiddleware
{
    public function __construct(private CommandStepLog $steps, private ConnectionInterface $database) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        $this->steps->add($this->stepLine());
        $this->database->table('module_command_rows')->insert(['text' => 'audit '.CommandName::of($call->name())]);

        return $next($call);
    }

    /**
     * The line the step log records for each command this middleware audits.
     */
    abstract protected function stepLine(): string;
}
