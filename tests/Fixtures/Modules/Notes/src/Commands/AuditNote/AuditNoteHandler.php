<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\AuditNote;

use App\Bus\Contracts\CommandHandler;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\ConnectionInterface;
use Tests\Fixtures\Modules\Notes\Events\NoteAudited;
use Tests\Fixtures\Modules\Notes\Exceptions\NoteWorkFailed;

final readonly class AuditNoteHandler implements CommandHandler
{
    public function __construct(private ConnectionInterface $database, private Dispatcher $events) {}

    /**
     * @throws NoteWorkFailed when the command asks to fail after its dispatch
     */
    public function handle(AuditNoteCommand $command): int
    {
        $id = (int) $this->database->table('module_command_rows')->insertGetId(['text' => $command->text]);
        $this->events->dispatch(new NoteAudited());

        if ($command->fails) {
            throw NoteWorkFailed::afterItsAudit();
        }

        return $id;
    }
}
