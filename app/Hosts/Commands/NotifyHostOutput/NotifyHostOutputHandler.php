<?php

declare(strict_types=1);

namespace App\Hosts\Commands\NotifyHostOutput;

use App\Bus\Contracts\CommandHandler;
use App\Exceptions\HostProtocolRefused;
use App\Hosts\Data\HostOutputData;
use App\Hosts\HostCallReader;
use App\Hosts\ProcessFeed;
use App\Models\Hosts\HostProcess;
use App\Terminals\HostFrameScreens;
use Carbon\CarbonImmutable;
use Illuminate\Cache\RateLimiter;
use Psr\Log\LoggerInterface;

/**
 * Puts the output in the process's feed and shows a journal-driven terminal's newest frame on its page; output over
 * the post limit or for another host's process is refused, and logged at most once a minute per host.
 */
final readonly class NotifyHostOutputHandler implements CommandHandler
{
    public function __construct(
        private ProcessFeed $feed,
        private HostFrameScreens $screens,
        private RateLimiter $limiter,
        private LoggerInterface $log,
        private HostCallReader $reader,
    ) {}

    public function handle(NotifyHostOutputCommand $command): void
    {
        if (strlen($command->body) > HostOutputData::BYTE_LIMIT) {
            $this->logOnce($command->hostId, 'A host sent process output over the post limit.');

            throw HostProtocolRefused::outputTooLarge($command->processId, strlen($command->body));
        }

        $process = HostProcess::findLocked($command->processId);

        if ($process->host_id !== $command->hostId) {
            $this->logOnce($command->hostId, 'A host sent output of a process it does not run.');

            throw HostProtocolRefused::foreignProcess($command->hostId, $process->id);
        }

        $output = $this->reader->read($command->body, HostOutputData::class, 'output of process '.$command->processId);
        $this->feed->push($process->id, $output);
        $this->screens->show($process, $output, CarbonImmutable::now());
        $process->recordOutputThrough($output->stdoutThrough());
    }

    private function logOnce(string $hostId, string $message): void
    {
        $this->limiter->attempt(
            "host-output-refused:{$hostId}",
            1,
            fn () => $this->log->warning($message, ['host' => $hostId]),
            60,
        );
    }
}
