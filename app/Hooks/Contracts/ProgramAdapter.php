<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Programs\HookPayload;
use App\Hooks\Programs\ProgramCapabilities;
use App\Hooks\Programs\ProgramReply;
use App\Hooks\Programs\ProgramToolInput;
use App\Hooks\Stack\HookAnswer;

/**
 * Turns the journal's final answer into one program's native reply. An adapter maps only the hooks its capabilities
 * list.
 */
interface ProgramAdapter
{
    public function capabilities(): ProgramCapabilities;

    /**
     * The arguments that start this program on the selected model.
     *
     * @return list<string>
     */
    public function modelArguments(string $model): array;

    /**
     * Reads one native hook payload into a call the journal answers or lets through, refusing what it does not map.
     */
    public function callFor(HookPayload $payload, HookIdentity $hook): ProgramCall;

    public function renderShell(HookAnswer $answer, ProgramToolInput $original): ProgramReply;

    public function renderStop(HookAnswer $answer): ProgramReply;
}
