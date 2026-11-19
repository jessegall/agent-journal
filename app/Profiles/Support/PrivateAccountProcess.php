<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Profiles\Exceptions\SignInProtocolMissing;

/**
 * A program's sign-in process on the host: started with exactly the arguments and environment given, its standard
 * input kept for the person's code, its output read into a small private buffer that is never logged or recorded,
 * and stopped when its attempt ends.
 */
final class PrivateAccountProcess
{
    private const int BUFFER_BYTES = 65536;

    private string $buffer = '';

    /**
     * @param  resource  $process
     * @param  array<int, resource>  $pipes
     */
    private function __construct(private $process, private array $pipes) {}

    /**
     * @param  list<string>  $arguments
     * @param  array<string, string>  $environment
     */
    public static function start(array $arguments, array $environment, string $workingDirectory): self
    {
        $streams = [0 => ['pipe', 'r'], 1 => ['pipe', 'w'], 2 => ['pipe', 'w']];
        $process = proc_open($arguments, $streams, $pipes, $workingDirectory, $environment);

        if (! is_resource($process)) {
            throw SignInProtocolMissing::cannotStart($arguments[0]);
        }

        stream_set_blocking($pipes[1], false);
        stream_set_blocking($pipes[2], false);

        return new self($process, $pipes);
    }

    /**
     * Gives the program a line on its standard input, such as the code the person typed.
     */
    public function send(string $line): void
    {
        fwrite($this->pipes[0], $line.PHP_EOL);
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

    public function isRunning(): bool
    {
        return proc_get_status($this->process)['running'];
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
    }
}
