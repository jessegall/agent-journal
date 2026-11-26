<?php

declare(strict_types=1);

namespace App\Commands\Hosts\NotifyHostOutput;

use App\Contracts\Bus\CommandHandler;
use App\Data\Hosts\HostOutputData;
use App\Exceptions\HostProtocolRefused;
use App\Models\Hosts\HostProcess;
use App\Support\Hosts\ProcessFeed;
use Illuminate\Cache\RateLimiter;
use Psr\Log\LoggerInterface;

/**
 * Puts the output in the process's feed; output over the post limit or for another host's process is refused, and
 * logged at most once a minute per host.
 */
final readonly class NotifyHostOutputHandler implements CommandHandler
{
    public function __construct(
        private ProcessFeed $feed,
        private RateLimiter $limiter,
        private LoggerInterface $log,
    ) {}

    public function handle(NotifyHostOutputCommand $command): void
    {
        if (strlen($command->body) > HostOutputData::MAXIMUM_BYTES) {
            $this->logOnce($command->hostId, 'A host sent process output over the post limit.');

            throw HostProtocolRefused::outputTooLarge($command->processId, strlen($command->body));
        }

        $process = HostProcess::findLocked($command->processId);

        if ($process->host_id !== $command->hostId) {
            $this->logOnce($command->hostId, 'A host sent output of a process it does not run.');

            throw HostProtocolRefused::foreignProcess($command->hostId, $process->id);
        }

        $output = HostOutputData::from(json_decode($command->body, true, flags: JSON_THROW_ON_ERROR));
        $this->feed->push($process->id, $output);
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
