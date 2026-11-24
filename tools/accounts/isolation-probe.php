<?php

declare(strict_types=1);

/*
 * The trusted side of the account-isolation acceptance run. Run by root on
 * the protected host against one agent container; every step runs inside it as the program's user 10001, never as
 * the model's executor. It never prints a credential byte, a token or the canary itself: only hashes, and of the
 * credential file only its time, inode, mode and, for Claude, the expiry number.
 *
 *   php tools/accounts/isolation-probe.php setup <session> [--program=claude|codex]
 *   php tools/accounts/isolation-probe.php expect <session>
 *   php tools/accounts/isolation-probe.php credential-state <session> [--program=claude|codex]
 *   php tools/accounts/isolation-probe.php cleanup <session>
 *   php tools/accounts/isolation-probe.php transcript <session>
 *   php tools/accounts/isolation-probe.php executor <session> < line
 *
 * Each step enters the session's newest container. A headless program runs each turn in a container that ends with the
 * turn and is later removed, so an ended or removed one is entered through a new container of its image with its
 * mounts, read from the session container's spec, which is kept, without its environment, under
 * storage/acceptance/sessions each time a container is seen. The executor step runs the line on standard input as the session's Bash tool
 * hands it on: through the shell bridge to the executor, in a container started as the session's own, from its init,
 * with its mounts, users, capabilities and limits, and prints what the line printed.
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

[$step, $session] = [$argv[1] ?? '', $argv[2] ?? ''];
$program = 'claude';

foreach (array_slice($argv, 3) as $option) {
    if (str_starts_with($option, '--program=')) {
        $program = substr($option, strlen('--program='));
    }
}

if ($session === '' || ! array_key_exists($program, CREDENTIALS)) {
    fwrite(STDERR, "Usage: isolation-probe.php setup|expect|credential-state|cleanup|transcript|executor <session> [--program=claude|codex]\n");
    exit(2);
}

// The executor step's line comes first, before a docker call can take standard input.
$line = $step === 'executor' ? trim((string) stream_get_contents(STDIN)) : '';
$docker = preg_split('/\s+/', trim((string) (getenv('JOURNAL_AGENT_DOCKER') ?: 'docker compose exec -T agent-docker docker')));

$daemon = fn (string ...$arguments): string => (string) shell_exec(implode(' ', array_map('escapeshellarg', [...$docker, ...$arguments])));
$specFile = dirname(__DIR__, 2)."/storage/acceptance/sessions/{$session}.json";
$container = strtok($daemon('ps', '--all', '--filter', "label=journal.session={$session}", '--format', '{{.Names}}'), "\n") ?: '';

if ($container !== '') {
    $spec = json_decode($daemon('inspect', $container), true, 64, JSON_THROW_ON_ERROR)[0];
    // The environment carries the start's grant, which the kept spec must never hold.
    unset($spec['Config']['Env']);
    @mkdir(dirname($specFile), 0o700, true);
    file_put_contents($specFile, json_encode($spec, JSON_THROW_ON_ERROR));
} elseif (is_file($specFile)) {
    $spec = json_decode((string) file_get_contents($specFile), true, 64, JSON_THROW_ON_ERROR);
} else {
    fwrite(STDERR, "The session {$session} has no container, and none was seen before to read its mounts from.\n");
    exit(1);
}

$isRunning = $container !== '' && $spec['State']['Running'] === true;
$image = (string) $spec['Image'];
$mounts = array_merge(...array_map(fn (array $mount): array => ['--mount', implode(',', array_filter([
    'type='.$mount['Type'],
    'src='.($mount['Type'] === 'volume' ? $mount['Name'] : $mount['Source']),
    'dst='.$mount['Destination'],
    $mount['RW'] ? null : 'readonly',
]))], $spec['Mounts'] ?? []));
$entry = $isRunning
    ? ['exec', '-i', '-u', '10001', $container]
    : ['run', '--rm', '-i', '-u', '10001', '--network', 'none', ...$mounts, '--entrypoint', 'sh', $image, '-c'];

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
        $inContainer('rm -f '.CANARY.' '.MARKER.' /workspace/.account-link');
        echo "removed the canary, the marker and the workspace link\n";
        break;

    // The newest transcript the program wrote under its account folder, one JSON line per entry.
    case 'transcript':
        echo $inContainer('newest=$(ls -t $(find /home/journal/.account -name "*.jsonl" -path "*projects*") | head -n 1)'
            .' && cat "$newest"')->stdout;
        break;

    case 'executor':
        $host = $spec['HostConfig'];
        $limits = ['--user', '0:0', '--network', 'none', ...$mounts, '--pids-limit', (string) $host['PidsLimit']];
        $limits = [...$limits, ...($host['ReadonlyRootfs'] ? ['--read-only'] : [])];

        foreach ($host['CapDrop'] ?? [] as $capability) {
            array_push($limits, '--cap-drop', $capability);
        }

        foreach ($host['CapAdd'] ?? [] as $capability) {
            array_push($limits, '--cap-add', $capability);
        }

        foreach ($host['SecurityOpt'] ?? [] as $option) {
            array_push($limits, '--security-opt', $option);
        }

        foreach ($host['Tmpfs'] ?? [] as $path => $options) {
            array_push($limits, '--tmpfs', $options === '' ? $path : "{$path}:{$options}");
        }

        $bridge = [...$docker, 'run', '--rm', ...$limits, '--entrypoint', '/opt/journal/bin/journal-init', $image];
        $printed = (string) shell_exec(implode(' ', array_map(
            'escapeshellarg',
            [...$bridge, '--', '/opt/journal/shell/bash', '-c', $line],
        )).' 2>&1');
        echo implode("\n", array_filter(explode("\n", $printed), fn (string $printedLine): bool => $printedLine !== 'journal-init: ready'));
        break;

    default:
        fwrite(STDERR, "Name a step: setup, expect, credential-state, cleanup, transcript or executor.\n");
        exit(2);
}
