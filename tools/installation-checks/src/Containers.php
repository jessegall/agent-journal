<?php

declare(strict_types=1);

namespace Tools\InstallationChecks;

use RuntimeException;
use Symfony\Component\Process\Process;

/**
 * The checked installation's containers, reached from its checkout with docker compose: the app for reads of its
 * records, and the agent daemon for the session containers.
 */
final readonly class Containers
{
    public function __construct(private string $checkout) {}

    /**
     * Runs a read of the journal's records in the app container, from a template under reads/ filled with the values
     * given, and answers the JSON it prints last.
     *
     * @param  array<string, string>  $values
     * @return array<string, mixed>
     */
    public function read(string $template, array $values = []): array
    {
        // A read is kept as a PHP file to be checked like any other; tinker takes its code without the file's opening.
        $code = (string) preg_replace(
            '/^<\?php\s*(declare\(strict_types=1\);\s*)?/',
            '',
            (string) file_get_contents(__DIR__."/../reads/{$template}.php"),
        );

        foreach ($values as $name => $value) {
            $code = str_replace("{{{$name}}}", $value, $code);
        }

        $output = $this->run(['docker', 'compose', 'exec', '-T', 'app', 'php', 'artisan', 'tinker', '--execute', $code]);
        $lines = array_values(array_filter(explode("\n", trim($output))));

        return json_decode((string) end($lines), true, 32, JSON_THROW_ON_ERROR);
    }

    /**
     * The name of the newest container the agent daemon made for the session, running or ended; empty before the first.
     */
    public function sessionContainer(string $sessionId): string
    {
        $names = $this->agentDaemon(['ps', '--all', '--filter', "label=journal.session={$sessionId}", '--format', '{{.Names}}']);

        // The daemon lists the newest container first.
        return strtok($names, "\n") ?: '';
    }

    /**
     * The newest transcript the program wrote for the session, one JSON line per entry.
     *
     * @return list<array<string, mixed>>
     */
    public function transcript(string $sessionId, string $program): array
    {
        $lines = explode("\n", trim($this->probe('transcript', $sessionId, $program)));

        return array_values(array_filter(array_map(
            fn (string $line): mixed => json_decode($line, true),
            $lines,
        ), 'is_array'));
    }

    /**
     * Runs the trusted probe of tools/accounts against the session's newest container and answers what it printed.
     */
    public function probe(string $step, string $sessionId, string $program): string
    {
        $container = $this->sessionContainer($sessionId);

        return $this->run(['php', 'tools/accounts/isolation-probe.php', $step, $container, "--program={$program}"]);
    }

    /**
     * @param  list<string>  $arguments
     */
    private function agentDaemon(array $arguments): string
    {
        return $this->run(['docker', 'compose', 'exec', '-T', 'agent-docker', 'docker', ...$arguments]);
    }

    /**
     * @param  list<string>  $command
     */
    private function run(array $command): string
    {
        $process = new Process($command, $this->checkout, null, null, 300);
        $process->run();

        if (! $process->isSuccessful()) {
            throw new RuntimeException(sprintf(
                '%s ended with %d: %s',
                $command[0].' '.($command[1] ?? ''),
                (int) $process->getExitCode(),
                substr(trim($process->getErrorOutput()) ?: trim($process->getOutput()), 0, 400),
            ));
        }

        return $process->getOutput();
    }
}
