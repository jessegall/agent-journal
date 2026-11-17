<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Programs;

use App\Domain\Hooks\Stack\HookAnswer;

/**
 * Turns the journal's final answer into one program's native reply. An adapter maps only the hooks its capabilities list.
 */
interface ProgramAdapter
{
    public function capabilities(): ProgramCapabilities;

    public function renderShell(HookAnswer $answer, NativeToolInput $original): ProgramReply;

    public function renderStop(HookAnswer $answer): ProgramReply;
}
