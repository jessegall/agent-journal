<?php

declare(strict_types=1);

namespace App\Terminals;

use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Protocol\Payloads\HostFramePayload;
use App\Hosts\Protocol\Payloads\HostOutputPayload;
use App\Models\Agents\AgentRuntime;
use App\Models\Hosts\HostProcess;
use App\Terminals\Data\ScreenFrameData;
use Carbon\CarbonImmutable;

/**
 * The screen the terminal page shows of an agent terminal the journal drives, taken from the frames its host streams
 * into the process's feed: the newest frame of each post is the screen, a shielded one shown hidden.
 */
final readonly class HostFrameScreens
{
    public function __construct(private RuntimeScreen $screens) {}

    public function show(HostProcess $process, HostOutputPayload $output, CarbonImmutable $now): void
    {
        $frame = $output->frames[array_key_last($output->frames) ?? 0] ?? null;

        if ($frame === null || $process->purpose !== HostProcessPurpose::AgentTerminal) {
            return;
        }

        $runtime = AgentRuntime::query()->whereKey($process->agent_runtime_id)->sole();
        $this->screens->admit(ScreenRegistration::of($runtime), self::screenOf($process, $frame, $now), $now);
    }

    private static function screenOf(
        HostProcess $process,
        HostFramePayload $frame,
        CarbonImmutable $now,
    ): ScreenFrameData
    {
        return ScreenFrameData::from([
            'epoch' => "{$process->id}:{$process->generation}",
            'sequence' => $frame->captured,
            'captured' => $now->toIso8601ZuluString(),
            'columns' => $frame->columns,
            'rows' => array_map(fn (string $row) => [['text' => $row]], $frame->rows),
            'cursor' => ['row' => $frame->cursorRow, 'column' => $frame->cursorColumn, 'isVisible' => true],
            'buffer' => $frame->buffer,
            'is_plain' => true,
            'is_too_large' => false,
            'is_unreadable' => false,
            'has_no_terminal' => false,
            'is_shielded' => $frame->isShielded,
            'stream' => 'host',
        ]);
    }
}
