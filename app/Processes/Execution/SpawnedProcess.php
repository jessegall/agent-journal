<?php

declare(strict_types=1);

namespace App\Processes\Execution;

use App\Processes\Contracts\StopSignal;
use App\Processes\Enums\OutputStream;
use App\Processes\Values\PartEnd;

/**
 * One external part started with proc_open from an argv array, never a shell string. It hands each piece of its output
 * to a callback as it is read and reports its own end: an exit status, or the signal that killed it.
 */
final class SpawnedProcess
{
    /**
     * How long the streams may stay open after the process ended, for descendants that still hold them.
     */
    public const int DRAIN_SECONDS = 10;

    /**
     * The most bytes of one stream gathered before they are handed on as one piece.
     */
    private const int PIECE_BYTE_LIMIT = 1_048_576;

    /**
     * @var array{running: bool, signaled: bool, termsig: int, exitcode: int}|null
     */
    private array|null $endStatus = null;

    /**
     * @param  resource  $process
     * @param  array<int, resource>  $pipes
     */
    private function __construct(private $process, private array $pipes, public readonly int $pid) {}

    /**
     * @param  list<string>  $argv
     * @param  array<int, array<int, string|int>>  $descriptors
     * @param  array<string, string>  $environment
     */
    public static function start(array $argv, array $descriptors, string $folder, array $environment): self|string
    {
        $command = ['setsid', ...$argv];
        $error = '';
        set_error_handler(function (int $level, string $message) use (&$error): bool {
            $error = $message;

            return true;
        });
        pcntl_signal(SIGPIPE, SIG_DFL);
        try {
            // @phpstan-ignore argument.type (proc_open takes ['redirect', <descriptor>]; its stub does not say so)
            $process = proc_open($command, $descriptors, $pipes, $folder, $environment);
        } finally {
            restore_error_handler();
            pcntl_signal(SIGPIPE, SIG_IGN);
        }
        if (! is_resource($process)) {
            return $error === '' ? "{$command[0]} could not be started" : $error;
        }
        $status = proc_get_status($process);

        return new self($process, $pipes, (int) $status['pid']);
    }

    /**
     * Reads both output streams until they close, handing each piece to the callback. It reports false when the streams
     * were still open at the drain deadline after the process ended, so the capture is incomplete.
     *
     * @param  callable(OutputStream, string): void  $onOutput
     */
    public function drain(
        callable $onOutput,
        float $drainSeconds = self::DRAIN_SECONDS,
        StopSignal $stop = new NoStop(),
    ): bool {
        $deadline = null;
        $streams = array_filter([1 => $this->pipes[1] ?? null, 2 => $this->pipes[2] ?? null], is_resource(...));
        foreach ($streams as $stream) {
            stream_set_blocking($stream, false);
        }
        /**
         * @var array<int, string> $gathered
         */
        $gathered = [1 => '', 2 => ''];
        $emitOutput = function (int $descriptor, int $atLeast) use (&$gathered, $onOutput): void {
            if ($gathered[$descriptor] !== '' && strlen($gathered[$descriptor]) >= $atLeast) {
                $onOutput($descriptor === 1 ? OutputStream::Stdout : OutputStream::Stderr, $gathered[$descriptor]);
                $gathered[$descriptor] = '';
            }
        };
        while ($streams !== [] && ! $stop->isRequested()) {
            $read = array_values($streams);
            $write = null;
            $except = null;
            $ready = stream_select($read, $write, $except, 1);
            if ($ready === false) {
                break;
            }
            foreach ($streams as $descriptor => $stream) {
                $bytes = fread($stream, 1_048_576);
                $gathered[$descriptor] .= $bytes === false ? '' : $bytes;
                $emitOutput($descriptor, $ready === 0 || feof($stream) ? 1 : self::PIECE_BYTE_LIMIT);
                if (feof($stream)) {
                    fclose($stream);
                    unset($streams[$descriptor]);
                }
            }
            $deadline ??= $this->hasEnded() ? microtime(true) + $drainSeconds : null;
            if ($deadline !== null && $streams !== [] && microtime(true) > $deadline) {
                array_map(fclose(...), $streams);
                $emitOutput(1, 1);
                $emitOutput(2, 1);

                return false;
            }
        }
        $emitOutput(1, 1);
        $emitOutput(2, 1);

        return $streams === [];
    }

    /**
     * Waits for the process to end and reports how: its exit status, or the signal that killed it, never a made-up
     * status.
     */
    public function wait(): PartEnd
    {
        while (! $this->hasEnded()) {
            usleep(10_000);
        }
        $status = $this->endStatus;
        proc_close($this->process);
        if ($status === null) {
            return PartEnd::unavailable('The process status could not be read.');
        }

        return match (true) {
            $status['signaled'] => PartEnd::signalled($status['termsig']),
            $status['exitcode'] >= 0 => PartEnd::exited($status['exitcode']),
            default => PartEnd::unavailable('The process status was already collected elsewhere.'),
        };
    }

    /**
     * The supervisor's ends of the child's pipes that are still open, by descriptor.
     *
     * @return array<int, resource>
     */
    public function openPipes(): array
    {
        return array_filter($this->pipes, is_resource(...));
    }

    /**
     * Stops the process and every descendant in its group: a polite signal, then after the grace period a forced one.
     * It reports false when something still runs after the forced signal.
     */
    public function stopGroup(float $graceSeconds): bool
    {
        posix_kill(-$this->pid, SIGTERM);
        $deadline = microtime(true) + $graceSeconds;
        while (! $this->hasEnded() && microtime(true) < $deadline) {
            usleep(20_000);
        }
        posix_kill(-$this->pid, SIGKILL);
        $deadline = microtime(true) + 1;
        while (! $this->hasEnded() && microtime(true) < $deadline) {
            usleep(20_000);
        }

        return $this->hasEnded();
    }

    /**
     * Whether the process ended; its end status is kept, since the system reports it only once.
     */
    public function hasEnded(): bool
    {
        if ($this->endStatus === null) {
            $status = proc_get_status($this->process);
            $this->endStatus = $status['running'] ? null : $status;
        }

        return $this->endStatus !== null;
    }

    public function kill(int $signal): void
    {
        proc_terminate($this->process, $signal);
    }
}
