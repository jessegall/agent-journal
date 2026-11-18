<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\CommandMiddleware;

use App\Core\Bus\Contracts\CommandMiddleware;
use App\Core\Bus\Support\CommandCall;
use Closure;
use Illuminate\Database\ConnectionInterface;
use Tests\Fixtures\Modules\Notes\Support\CommandTrail;

/**
 * Writes an audit row for each command of Notes inside its transaction.
 */
final readonly class AuditNotes implements CommandMiddleware
{
    public function __construct(private CommandTrail $trail, private ConnectionInterface $database) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        $this->trail->add('notes inside');
        $this->database->table('module_command_rows')->insert(['text' => 'audit '.class_basename($call->name())]);

        return $next($call);
    }
}
