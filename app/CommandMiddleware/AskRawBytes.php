<?php

declare(strict_types=1);

namespace App\CommandMiddleware;

use App\Bus\CommandCall;
use App\Bus\Contracts\CommandMiddleware;
use App\Hosts\Commands\OpenHostProcess\OpenHostProcessCommand;
use App\Hosts\Protocol\HostProcessType;
use App\Recordings\RecordingDrafts;
use Closure;

/**
 * While recording is on, a terminal is opened asking the host for its bytes from the first one, so the recording
 * keeps what the program printed; with recording off nothing changes, and no command knows the recorder.
 */
final readonly class AskRawBytes implements CommandMiddleware
{
    public function __construct(private RecordingDrafts $drafts) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        $command = $call->command();

        if (! $command instanceof OpenHostProcessCommand) {
            return $next($call);
        }

        if ($command->plan->type !== HostProcessType::Terminal || ! $this->drafts->isOn()) {
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
