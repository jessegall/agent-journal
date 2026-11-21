<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Inputs\DriverToolInput;
use App\Hooks\Drivers\HookPayload;
use App\Hooks\Drivers\DriverCapabilities;
use App\Hooks\Drivers\DriverReply;
use App\Hooks\Stack\HookAnswer;
use App\Hooks\Support\DriverCompatibility;

/**
 * Turns the journal's final answer into one program's native reply. An adapter maps only the hooks its capabilities
 * list.
 */
interface DriverAdapter
{
    public function capabilities(): DriverCapabilities;

    /**
     * What an account start of the pinned program may rely on, and how far the real program showed it.
     */
    public function compatibility(): DriverCompatibility;

    /**
     * The arguments that start this program on the selected model.
     *
     * @return list<string>
     */
    public function modelArguments(string $model): array;

    /**
     * Reads one native hook payload into a call the journal answers or lets through, refusing what it does not map.
     */
    public function callFor(HookPayload $hookInput, HookIdentity $hook): DriverCall;

    public function renderShell(HookAnswer $answer, DriverToolInput $original): DriverReply;

    public function renderStop(HookAnswer $answer): DriverReply;
}
