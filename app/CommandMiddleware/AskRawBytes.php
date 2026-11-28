<?php

declare(strict_types=1);

namespace App\CommandMiddleware;

use App\Agents\Drivers\Commands\RecordOwnTerminal\RecordOwnTerminalCommand;
use App\Bus\CommandCall;
use App\Bus\Contracts\CommandMiddleware;
use App\Hosts\Commands\OpenHostProcess\OpenHostProcessCommand;
use App\Hosts\Protocol\HostProcessType;
use App\Support\Recordings\Enums\Wire;
use App\Support\Recordings\RecordingDrafts;
use App\Support\Recordings\RecordingOpening;
use Closure;

/**
 * While recording is on, a terminal is opened asking the host for its bytes from the first one, so the recording
 * keeps what the driver printed; with recording off nothing changes, and no command knows the recorder.
 */
final readonly class AskRawBytes implements CommandMiddleware
{
    public function __construct(private RecordingDrafts $drafts) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        $command = $call->command();

        if (! $this->drafts->isOn()) {
            return $next($call);
        }

        if ($command instanceof RecordOwnTerminalCommand) {
            $terminal = $next($call->replacedBy($command->askingRawBytes()));

            $opening = RecordingOpening::ofProcess(
                $terminal->processId,
                $terminal->plan->payload(),
                RecordingDrafts::moment(),
            );

            $this->drafts->begin(Wire::Driver, $terminal->processId, $opening->withEnvironmentNames());

            return $terminal;
        }

        if (! $command instanceof OpenHostProcessCommand) {
            return $next($call);
        }

        if ($command->plan->type !== HostProcessType::Terminal) {
            return $next($call);
        }

        return $next($call->replacedBy(new OpenHostProcessCommand(
            $command->hostId,
            $command->runtimeId,
            $command->plan->askingRawBytes(),
            $command->source,
            $command->sessionProcessId,
        )));
    }
}
