<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Support;

use App\Contracts\CommandMiddleware;
use App\Support\CommandCall;
use App\Support\CommandName;
use Closure;
use Illuminate\Database\ConnectionInterface;

/**
 * Writes an audit row for each command it watches inside the command's transaction, and adds its own line to the trail.
 */
abstract readonly class AuditCommands implements CommandMiddleware
{
    public function __construct(private CommandTrail $trail, private ConnectionInterface $database) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        $this->trail->add($this->trailLine());
        $this->database->table('module_command_rows')->insert(['text' => 'audit '.CommandName::of($call->name())]);

        return $next($call);
    }

    /**
     * The line the trail records for each command this middleware audits.
     */
    abstract protected function trailLine(): string;
}
