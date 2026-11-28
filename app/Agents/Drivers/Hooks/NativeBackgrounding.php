<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Hooks;

use App\Actors\Contracts\AgentTexts;
use App\Agents\Drivers\Contracts\DriverCall;
use App\Agents\Values\CommandPart;
use App\Values\AgentText;
use App\Values\ShellCommand;

/**
 * The one check every driver's hook puts a shell call through so that no process escapes the journal: a line that
 * sends a command to the background with &, or detaches it with nohup, setsid or disown, is refused, as is a driver's
 * own background run, and the refusal names the journal's own background run instead.
 */
final readonly class NativeBackgrounding
{
    /**
     * The programs that detach a command from the shell that started it.
     */
    private const array DETACHING_PROGRAMS = [
        'nohup',
        'setsid',
        'disown',
    ];

    public function __construct(private AgentTexts $texts) {}

    /**
     * Whether the line backgrounds or detaches a command on its own.
     */
    public function isInLine(ShellCommand $command): bool
    {
        return $command->hasBackgroundJob || array_any(
            $command->parts,
            fn (CommandPart $part) => in_array(basename($part->program), self::DETACHING_PROGRAMS, true),
        );
    }

    /**
     * The refusal of a call that backgrounds a command natively, pointing to the journal's own background run.
     */
    public function refusal(): DriverCall
    {
        $reason = $this->texts->render(AgentText::of('core.shell.native_background'));

        return new UnjudgedCall(DriverReplies::denyTool($reason, []));
    }
}
