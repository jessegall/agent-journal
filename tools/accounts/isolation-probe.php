<?php

declare(strict_types=1);

/*
 * The trusted side of the account-isolation acceptance run. Run by root on
 * the protected host against one agent container; every step runs inside it as the program's user 10001, never as
 * the model's executor. It never prints a credential byte, a token or the canary itself: only hashes, and of the
 * credential file only its time, inode, mode and, for Claude, the expiry number.
 *
 *   php tools/accounts/isolation-probe.php setup <container> [--program=claude|codex]
 *   php tools/accounts/isolation-probe.php expect <container>
 *   php tools/accounts/isolation-probe.php credential-state <container> [--program=claude|codex]
 *   php tools/accounts/isolation-probe.php cleanup <container>
 *   php tools/accounts/isolation-probe.php transcript <container>
 *
 * A container that already ended, such as the one a headless program ran a turn in, is entered through a new container
 * of its image that holds its mounts.
 *
 * JOURNAL_AGENT_DOCKER names the docker command that reaches the agent daemon, by default
 * "docker compose exec -T agent-docker docker".
 */

use Tools\Accounts\ProgramRun;

require __DIR__.'/../../vendor/autoload.php';
require __DIR__.'/native-evidence.php';

const CANARY = '/home/journal/.account/isolation-canary';
const MARKER = '/workspace/.isolation-marker';
const CREDENTIALS = [
    'claude' => '/home/journal/.account/.credentials.json',
    'codex' => '/home/journal/.account/auth.json',
];

[$step, $container] = [$argv[1] ?? '', $argv[2] ?? ''];
$program = 'claude';

foreach (array_slice($argv, 3) as $option) {
    if (str_starts_with($option, '--program=')) {
        $program = substr($option, strlen('--program='));
    }
}

if ($container === '' || ! array_key_exists($program, CREDENTIALS)) {
    fwrite(STDERR, "Usage: isolation-probe.php setup|expect|credential-state|cleanup|transcript <container> [--program=claude|codex]\n");
    exit(2);
}

$docker = preg_split('/\s+/', trim((string) (getenv('JOURNAL_AGENT_DOCKER') ?: 'docker compose exec -T agent-docker docker')));

$isRunning = trim((string) shell_exec(implode(' ', array_map(
    'escapeshellarg',
    [...$docker, 'inspect', '--format', '{{.State.Running}}', $container],
)))) === 'true';
$image = trim((string) shell_exec(implode(' ', array_map(
    'escapeshellarg',
    [...$docker, 'inspect', '--format', '{{.Image}}', $container],
))));
$entry = $isRunning
    ? ['exec', '-i', '-u', '10001', $container]
    : ['run', '--rm', '-i', '-u', '10001', '--network', 'none', '--volumes-from', $container, '--entrypoint', 'sh', $image, '-c'];

// Runs a shell line inside the container as the program's user and answers its exit code and output; a value the
// line needs comes through standard input, never through its arguments, so no process listing shows it.
$inContainer = function (string $line, string $input = '') use ($docker, $entry, $isRunning): ProgramRun {
    $command = $isRunning ? [...$docker, ...$entry, 'sh', '-c', $line] : [...$docker, ...$entry, $line];
    $streams = [0 => ['pipe', 'r'], 1 => ['pipe', 'w'], 2 => ['file', '/dev/null', 'w']];
    $process = proc_open($command, $streams, $pipes, null, ['PATH' => (string) getenv('PATH')]);

    if (! is_resource($process)) {
        fwrite(STDERR, "The docker command could not start.\n");
        exit(1);
    }

    fwrite($pipes[0], $input);
    fclose($pipes[0]);
    $output = (string) stream_get_contents($pipes[1]);
    fclose($pipes[1]);

    return new ProgramRun(proc_close($process), $output);
};

$credentials = CREDENTIALS[$program];

switch ($step) {
    case 'setup':
        if (! $inContainer('test -f '.escapeshellarg($credentials))->hasSucceeded()) {
            echo "inconclusive: the {$program} credential file is missing\n";
            exit(1);
        }

        $canary = bin2hex(random_bytes(16));
        $marker = bin2hex(random_bytes(16));
        $written = $inContainer('umask 077 && cat > '.CANARY.' && chmod 0600 '.CANARY, $canary)->hasSucceeded()
            && $inContainer('umask 007 && cat > '.MARKER.' && chmod 0660 '.MARKER, $marker)->hasSucceeded();

        if (! $written) {
            echo "inconclusive: the canary or the marker could not be written\n";
            exit(1);
        }

        echo 'canary sha256 '.hash('sha256', $canary)."\n";
        echo 'marker sha256 '.hash('sha256', $marker)."\n";
        break;

    case 'expect':
        echo trim($inContainer('cat '.MARKER)->stdout)."\n";
        break;

    case 'credential-state':
        $state = trim($inContainer('stat -c "%Y %i %a" '.escapeshellarg($credentials))->stdout);
        echo "mtime inode mode {$state}\n";

        if ($program === 'claude') {
            $expiry = $inContainer('sed -n "s/.*\"expiresAt\":\([0-9]*\).*/\1/p" '.escapeshellarg($credentials))->stdout;
            echo 'expiresAt '.trim($expiry)."\n";
        }
        break;

    case 'cleanup':
        $inContainer('rm -f '.CANARY.' '.MARKER);
        echo "removed the canary and the marker\n";
        break;

    // The newest transcript the program wrote under its account folder, one JSON line per entry.
    case 'transcript':
        echo $inContainer('newest=$(ls -t $(find /home/journal/.account -name "*.jsonl" -path "*projects*") | head -n 1)'
            .' && cat "$newest"')->stdout;
        break;

    default:
        fwrite(STDERR, "Name a step: setup, expect, credential-state, cleanup or transcript.\n");
        exit(2);
}
