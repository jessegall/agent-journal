<?php

declare(strict_types=1);

namespace App\Support\Drivers\Contracts;

use App\Support\Compatibility\DriverCompatibility;
use App\Support\Drivers\DriverCapabilities;
use App\Support\Drivers\DriverReply;
use App\Support\Drivers\HookPayload;
use App\Support\Inputs\Values\DriverToolInput;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Stack\HookAnswer;

/**
 * Turns the journal's final answer into one driver's native reply. An adapter maps only the hooks its capabilities
 * list.
 */
interface DriverAdapter
{
    /**
     * The key of the native hook protocol this adapter reads, which every driver registration of it names.
     */
    public function hookProtocol(): string;

    /**
     * The native hook events this adapter maps, which a driver's isolated settings register.
     *
     * @return list<string>
     */
    public function nativeEvents(): array;

    /**
     * The driver's own tools that start or reach another agent; they are always denied, since only the journal's
     * helpers and workers are ever started (rule 36).
     *
     * @return list<string>
     */
    public function nativeChildTools(): array;

    public function capabilities(): DriverCapabilities;

    /**
     * What an account start of the pinned driver may rely on, and how far the real driver showed it.
     */
    public function compatibility(): DriverCompatibility;

    /**
     * The allow rules that let the driver call the journal's own MCP tools without a native prompt: the literal
     * journal server prefix and never a wildcard for another server.
     *
     * @return list<string>
     */
    public function journalToolRules(): array;

    /**
     * The command the driver's isolated settings run for each native hook event.
     */
    public function hookCommand(): string;

    /**
     * Whether a transcript file name is that of the native conversation.
     */
    public function namesTranscriptOf(string $fileName, string $nativeId): bool;

    /**
     * Whether the driver saves a conversation's large tool outputs in a folder named for it beside its transcript.
     */
    public function keepsOutputsBesideTranscript(): bool;

    /**
     * The arguments that start this driver on the selected model.
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
