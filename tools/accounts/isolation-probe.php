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
    fwrite(STDERR, "Usage: isolation-probe.php setup|expect|credential-state|cleanup <container> [--program=claude|codex]\n");
    exit(2);
}

$docker = preg_split('/\s+/', trim((string) (getenv('JOURNAL_AGENT_DOCKER') ?: 'docker compose exec -T agent-docker docker')));

// Runs a shell line inside the container as the program's user and answers its exit code and output; a value the
// line needs comes through standard input, never through its arguments, so no process listing shows it.
$inContainer = function (string $line, string $input = '') use ($docker, $container): ProgramRun {
    $command = [...$docker, 'exec', '-i', '-u', '10001', $container, 'sh', '-c', $line];
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
        if (! $inContainer('test -f '.escapeshellarg($credentials))->succeeded()) {
            echo "inconclusive: the {$program} credential file is missing\n";
            exit(1);
        }

        $canary = bin2hex(random_bytes(16));
        $marker = bin2hex(random_bytes(16));
        $written = $inContainer('umask 077 && cat > '.CANARY.' && chmod 0600 '.CANARY, $canary)->succeeded()
            && $inContainer('umask 007 && cat > '.MARKER.' && chmod 0660 '.MARKER, $marker)->succeeded();

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

    default:
        fwrite(STDERR, "Name a step: setup, expect, credential-state or cleanup.\n");
        exit(2);
}
