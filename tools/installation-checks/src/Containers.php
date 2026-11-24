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
     * The name of the container the agent daemon runs for the session, once it runs one.
     */
    public function sessionContainer(string $sessionId): string
    {
        return trim($this->agentDaemon(['ps', '--filter', "label=journal.session={$sessionId}", '--format', '{{.Names}}']));
    }

    /**
     * The newest transcript the program writes in the container, read as root, one JSON line per entry.
     *
     * @return list<array<string, mixed>>
     */
    public function transcript(string $container): array
    {
        $newest = trim($this->agentDaemon([
            'exec', $container, 'sh', '-c',
            'ls -t $(find /home/journal/.account -name "*.jsonl" -path "*projects*" 2>/dev/null) 2>/dev/null | head -n 1',
        ]));

        if ($newest === '') {
            return [];
        }

        $lines = explode("\n", trim($this->agentDaemon(['exec', $container, 'cat', $newest])));

        return array_values(array_filter(array_map(
            fn (string $line): mixed => json_decode($line, true),
            $lines,
        ), 'is_array'));
    }

    /**
     * Runs the trusted probe of tools/accounts against the container and answers what it printed.
     */
    public function probe(string $step, string $container, string $program): string
    {
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
