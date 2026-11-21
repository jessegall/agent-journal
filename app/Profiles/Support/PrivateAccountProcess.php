<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Profiles\Exceptions\SignInAnswerUndelivered;
use App\Profiles\Exceptions\SignInProtocolMissing;
use Closure;

/**
 * A program's sign-in process on the host: started with exactly the arguments and environment given, its standard
 * input kept for the user's code, its output read into a small private buffer that is never logged or recorded,
 * and stopped when its attempt ends.
 */
final class PrivateAccountProcess
{
    private const int BUFFER_BYTES = 65536;

    /**
     * How long a status check may run before it is stopped and proves nothing.
     */
    private const int CHECK_SECONDS_LIMIT = 30;

    private bool $isClosed = false;

    private string $buffer = '';

    private int|null $exitCode = null;

    /**
     * @param  resource  $process
     * @param  array<int, resource>  $pipes
     */
    private function __construct(private $process, private array $pipes, private string $workingDirectory) {}

    /**
     * Starts the program; each read file is opened for it on its own descriptor, so a secret in a file reaches the
     * program without its arguments or environment.
     *
     * @param  list<string>  $arguments
     * @param  array<string, string>  $environment
     * @param  array<int, string>  $readFiles  the file each descriptor above 2 opens for reading
     */
    public static function start(
        array $arguments,
        array $environment,
        string $workingDirectory,
        array $readFiles = [],
    ): self {
        $files = array_map(fn (string $path) => ['file', $path, 'r'], $readFiles);
        $streams = [0 => ['pipe', 'r'], 1 => ['pipe', 'w'], 2 => ['pipe', 'w']] + $files;
        $process = proc_open($arguments, $streams, $pipes, $workingDirectory, $environment);

        if (! is_resource($process)) {
            throw SignInProtocolMissing::cannotStart($arguments[0]);
        }

        stream_set_blocking($pipes[1], false);
        stream_set_blocking($pipes[2], false);

        return new self($process, $pipes, $workingDirectory);
    }

    /**
     * A process that runs no program of its own and only holds a sign-in open until the owner's key or token
     * arrives; released, it ends with exit code 0.
     */
    public static function holding(string $workingDirectory): self
    {
        return self::start(['/bin/sh', '-c', 'read -r line'], ['PATH' => '/usr/bin:/bin'], $workingDirectory);
    }

    /**
     * Closes the program's standard input, for a program that reads it to its end.
     */
    public function closeInput(): void
    {
        fclose($this->pipes[0]);
        unset($this->pipes[0]);
    }

    /**
     * The account folder the process runs in.
     */
    public function workingDirectory(): string
    {
        return $this->workingDirectory;
    }

    /**
     * Ends a holding process, which waits for nothing more.
     */
    public function release(): void
    {
        $this->send('');
    }

    /**
     * Gives the program a line on its standard input, such as the code the user typed, whole.
     *
     * @throws SignInAnswerUndelivered
     */
    public function send(string $line): void
    {
        $text = $line.PHP_EOL;
        $written = @fwrite($this->pipes[0], $text);

        if ($written !== strlen($text) || ! fflush($this->pipes[0])) {
            throw SignInAnswerUndelivered::toProgram();
        }
    }

    /**
     * What the program printed so far, at most the buffer's size; its adapter reads challenges from it.
     */
    public function output(): string
    {
        foreach ([1, 2] as $stream) {
            $this->buffer .= (string) stream_get_contents($this->pipes[$stream]);
        }

        $this->buffer = substr($this->buffer, -self::BUFFER_BYTES);

        return $this->buffer;
    }

    /**
     * Waits for a short check to end, reading its output as it comes so a full pipe never stalls it, and answers what
     * it printed; a check still running after its time limit is stopped with no exit code.
     */
    public function finish(int $secondsLimit = self::CHECK_SECONDS_LIMIT): string
    {
        $this->waitFor(static fn () => false, $secondsLimit);
        $output = $this->output();
        $this->stop();

        return $output;
    }

    /**
     * Waits, draining the output, until what the program printed satisfies the test, the program ends or the time
     * limit passes, and answers whether the output satisfied it.
     *
     * @param  Closure(string): bool  $isSatisfied
     */
    public function waitFor(Closure $isSatisfied, int $secondsLimit = self::CHECK_SECONDS_LIMIT): bool
    {
        $deadline = microtime(true) + $secondsLimit;

        while ($this->isRunning() && microtime(true) < $deadline) {
            if ($isSatisfied($this->output())) {
                return true;
            }

            usleep(20_000);
        }

        return $isSatisfied($this->output());
    }

    public function isRunning(): bool
    {
        if ($this->isClosed) {
            return false;
        }

        $status = proc_get_status($this->process);

        if (! $status['running'] && $this->exitCode === null) {
            $this->exitCode = $status['exitcode'];
        }

        return $status['running'];
    }

    /**
     * How the process ended; null while it runs.
     */
    public function exitCode(): int|null
    {
        if ($this->exitCode !== null) {
            return $this->exitCode;
        }

        $this->isRunning();

        return $this->exitCode;
    }

    public function stop(): void
    {
        if ($this->isRunning()) {
            proc_terminate($this->process);
        }

        foreach ($this->pipes as $pipe) {
            fclose($pipe);
        }

        proc_close($this->process);
        $this->isClosed = true;
    }
}
