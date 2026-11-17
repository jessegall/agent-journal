<?php

declare(strict_types=1);

namespace App\Core\Hooks\Contracts;

use App\Core\Hooks\Inputs\HookIdentity;
use App\Core\Hooks\Programs\HookPayload;
use App\Core\Hooks\Programs\ProgramCapabilities;
use App\Core\Hooks\Programs\ProgramReply;
use App\Core\Hooks\Programs\ProgramToolInput;
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
    public function callFor(HookPayload $payload, HookIdentity $hook): ProgramCall;

    public function renderShell(HookAnswer $answer, ProgramToolInput $original): ProgramReply;

    public function renderStop(HookAnswer $answer): ProgramReply;
}
