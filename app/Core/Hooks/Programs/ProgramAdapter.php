<?php

declare(strict_types=1);

namespace App\Core\Hooks\Programs;

use App\Core\Hooks\Inputs\HookIdentity;
use App\Core\Hooks\Stack\HookAnswer;

/**
 * Turns the journal's final answer into one program's native reply. An adapter maps only the hooks its capabilities list.
 */
interface ProgramAdapter
{
    public function capabilities(): ProgramCapabilities;

    /**
     * Reads one native hook payload into a call the journal answers or lets through, refusing what it does not map.
     */
    public function callFor(HookPayload $payload, HookIdentity $hook): NativeCall;

    public function renderShell(HookAnswer $answer, NativeToolInput $original): ProgramReply;

    public function renderStop(HookAnswer $answer): ProgramReply;
}
