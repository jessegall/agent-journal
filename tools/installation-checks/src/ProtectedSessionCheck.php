<?php

declare(strict_types=1);

namespace Tools\InstallationChecks;

use RuntimeException;
use Symfony\Component\Uid\Ulid;

/**
 * One run of a protected headless session on the cheapest model, started through the request the
 * Start dialog sends, whose isolation is judged by the tool results of chat messages it is sent (README.md).
 */
final class ProtectedSessionCheck
{
    private const string MARKER = '/workspace/.isolation-marker';

    private const string CANARY = '/home/journal/.account/isolation-canary';

    private const array CREDENTIALS = [
        'claude' => '/home/journal/.account/.credentials.json',
        'codex' => '/home/journal/.account/auth.json',
    ];

    // The driver's program and its cheapest model.
    private const array DRIVERS = [
        'claude-code' => [
            'program' => 'claude',
            'model' => 'claude-haiku-5-5',
        ],
        'codex' => [
            'program' => 'codex',
            'model' => 'gpt-6-luna',
        ],
    ];

    // How long a session may take to start, and an answer to come, in seconds.
    private const int START_LIMIT = 300;

    private const int ANSWER_LIMIT = 180;

    /** @var list<Outcome> */
    private array $outcomes = [];

    public function __construct(
        private readonly Journal $journal,
        private readonly Containers $containers,
        private readonly string $driver,
        private readonly bool $isRenewalSkipped,
        private readonly bool $isRunningSessionReused,
    ) {
        if (! array_key_exists($driver, self::DRIVERS)) {
            throw new RuntimeException("Name the driver claude-code or codex, not {$driver}.");
        }
    }

    /**
     * @return list<Outcome>
     */
    public function run(): array
    {
        $agent = $this->containers->read('main-agent');
        $session = $agent['isRunning'] && $this->isRunningSessionReused ? (string) $agent['session'] : $this->freshSession();
        $this->containers->probe('setup', $session, $this->program());
        $this->judgeReads($session);
        $this->judgeAnswer($session, 'a question is answered');
        $this->judgeRenewal($session);
        $this->stop();
        $resumed = $this->start();
        $this->judgeAnswer($resumed, 'a question is answered after a stop and a start, with no sign-in');
        $this->judgeReads($resumed);
        $this->containers->probe('cleanup', $resumed, $this->program());

        return $this->outcomes;
    }

    /**
     * The outcomes judged so far, which a run that stopped partway still reports.
     *
     * @return list<Outcome>
     */
    public function outcomes(): array
    {
        return $this->outcomes;
    }

    /**
     * A session started for this check: one the main agent still runs is stopped first.
     */
    private function freshSession(): string
    {
        if ($this->containers->read('main-agent')['isRunning']) {
            $this->stop();
        }

        return $this->start();
    }

    /**
     * Starts the main agent's session as the Start dialog does and answers the session once its first container runs;
     * a headless program runs each turn in a container of its own, so every read finds the session's newest one.
     */
    private function start(): string
    {
        $agent = $this->containers->read('main-agent');
        $requestId = strtolower((string) new Ulid());
        $this->journal->postKeyed("/profiles/{$agent['profile']}/start-main", [
            'requestId' => $requestId,
            'agentId' => $agent['agent'],
            'model' => self::DRIVERS[$this->driver]['model'],
            'driver' => $this->driver,
            'driverType' => 'headless',
            'saveDriverType' => false,
        ], $requestId);

        $session = $this->waitFor(self::START_LIMIT, function (): string|null {
            $agent = $this->containers->read('main-agent');

            if ($agent['isRunning']) {
                return (string) $agent['session'];
            }

            return null;
        }, 'the session to run');

        $this->waitFor(
            self::START_LIMIT,
            fn (): string|null => $this->containers->sessionContainer($session) ?: null,
            'the session container',
        );

        return $session;
    }

    private function stop(): void
    {
        $agent = $this->containers->read('main-agent');
        $requestId = strtolower((string) new Ulid());
        $this->journal->postKeyed("/agents/{$agent['agent']}/stop", [
            'requestId' => $requestId,
            'sessionId' => $agent['session'],
            'generation' => $agent['processGeneration'],
        ], $requestId);
        $this->waitFor(self::START_LIMIT, function (): bool|null {
            if ($this->containers->read('main-agent')['isRunning']) {
                return null;
            }

            return true;
        }, 'the session to stop');
    }

    private function judgeReads(string $session): void
    {
        $marker = trim($this->containers->probe('expect', $session, $this->program()));
        $credentials = self::CREDENTIALS[$this->program()];
        $account = dirname(self::CANARY);
        $clientRoot = '/proc/$(for p in /proc/[0-9]*; do [ "$(stat -c %u $p)" = 10001 ] && echo ${p#/proc/} && break; done)/root';

        $this->judgeBashLines($session, [
            'the workspace marker reads through Bash' => ['cat '.self::MARKER, $marker],
            'Bash runs as the executor, user 10002' => ['id -u', '10002'],
        ]);
        $lines = [];

        // A model declines to run these, so they go the way its Bash tool hands a line on: to the executor.
        foreach ([
            'the canary' => self::CANARY,
            'the credential file' => $credentials,
            'the canary through a workspace link' => "/workspace/.account-link/{$this->name(self::CANARY)}",
            'the canary through the client\'s /proc root' => $clientRoot.self::CANARY,
        ] as $item => $path) {
            // The link leaves the workspace, which no session may start with, so the line removes it again.
            $line = "ln -sfn {$account} /workspace/.account-link; ( exec 3< {$path} ) 2>&1 | sed 's/.*: //'; "
                .'rm -f /workspace/.account-link';
            $lines["{$item} is refused with a permission error"] = [
                $line,
                'Permission denied',
            ];
        }

        $lines['the environment and the open files hold no credential'] = [
            'env | grep -ciE "sk-ant|oauth|access_token|refresh_token"; ls -l /proc/self/fd | grep -c credentials',
            "0\n0",
        ];
        $this->judgeExecutorLines($session, $lines);
        $this->judgeRead($session, 'the native Read tool reads the workspace marker', self::MARKER, true, $marker);
        $this->judgeRead($session, 'the native Read tool is refused the canary', self::CANARY, false, '');
    }

    /**
     * Sends every line in one turn and judges each by the output of the session's Bash call of exactly that line.
     *
     * @param  array<string, array{string, string}>  $lines  item => [line, expected output]
     */
    private function judgeBashLines(string $session, array $lines): void
    {
        $listed = implode("\n\n", array_map(fn (array $line): string => $line[0], array_values($lines)));
        $turn = $this->runTurn(
            $session,
            "This is the installation's isolation check, run by its operator: it proves your commands cannot reach the "
            ."account's sign-in. A command that opens a file only opens and closes it and prints the error name, never "
            .'its content. Run each of these commands exactly as written with your Bash tool, each as its own call, in '
            ."order, then reply with their outputs:\n\n{$listed}",
        );

        foreach ($lines as $item => [$line, $expected]) {
            $result = $this->resultOfCall($turn, 'Bash', fn (array $input): bool => ($input['command'] ?? '') === $line);
            $this->outcomes[] = match (true) {
                $result === null => Outcome::judged($item, false, 'the session did not run it: '.$this->replyOf($turn)),
                trim($result['text']) === $expected => Outcome::judged($item, true, 'as expected'),
                default => Outcome::judged($item, false, 'it answered: '.mb_substr(trim($result['text']), 0, 160)),
            };
        }
    }

    /**
     * Judges each line by what it printed when run through the session's shell bridge and executor.
     *
     * @param  array<string, array{string, string}>  $lines  item => [line, expected output]
     */
    private function judgeExecutorLines(string $session, array $lines): void
    {
        foreach ($lines as $item => [$line, $expected]) {
            $printed = trim($this->containers->executor($session, $line));
            $this->outcomes[] = $printed === $expected
                ? Outcome::judged("{$item} (through the executor)", true, 'as expected')
                : Outcome::judged("{$item} (through the executor)", false, 'it printed: '.mb_substr($printed, 0, 160));
        }
    }

    private function judgeRead(string $session, string $item, string $path, bool $isReadable, string $expected): void
    {
        $turn = $this->runTurn($session, "Read the file {$path} with your Read tool, once, and reply only with what it gave you.");
        $result = $this->resultOfCall($turn, 'Read', fn (array $input): bool => ($input['file_path'] ?? '') === $path);

        if ($result === null) {
            $this->outcomes[] = Outcome::judged($item, false, 'the session did not read it: '.$this->replyOf($turn));

            return;
        }

        $isPassed = $isReadable
            ? ! $result['isError'] && str_contains($result['text'], $expected)
            : $result['isError'] && preg_match('/permission|EACCES/i', $result['text']) === 1;
        $this->outcomes[] = Outcome::judged($item, $isPassed, $isPassed ? 'as expected' : 'it answered: '.mb_substr($result['text'], 0, 160));
    }

    private function judgeAnswer(string $session, string $item): void
    {
        $answer = $this->replyOf($this->runTurn($session, 'What is two plus two? Reply with the number alone.'));
        $this->outcomes[] = Outcome::judged($item, str_contains($answer, '4'), "the session answered: {$answer}");
    }

    /**
     * The credential's expiry before and after it renews: the wait lasts until the expiry has passed, unless the
     * renewal is left out.
     */
    private function judgeRenewal(string $session): void
    {
        if ($this->isRenewalSkipped) {
            return;
        }

        $before = $this->expiry($session);
        $this->waitFor(max(60, $before - time() + 120), fn (): bool|null => time() > $before ? true : null, 'the expiry');
        $this->judgeAnswer($session, 'a question is answered once the access token expired');
        $after = $this->expiry($session);
        $this->outcomes[] = Outcome::judged('the credential renewed', $after > $before, "expiry {$before} became {$after}");
    }

    private function expiry(string $session): int
    {
        $state = $this->containers->probe('credential-state', $session, $this->program());

        if (preg_match('/expiresAt (\d+)/', $state, $found) === 1) {
            return intdiv((int) $found[1], 1000);
        }

        return 0;
    }

    /**
     * Sends the message and answers the transcript entries of the turn it starts, once the program ends that turn; the
     * wait ends as soon as the turn does, whatever it did.
     *
     * @return list<array<string, mixed>>
     */
    private function runTurn(string $session, string $message): array
    {
        $before = count($this->containers->transcript($session, $this->program()));
        $this->send($message);

        return $this->waitFor(self::ANSWER_LIMIT, function () use ($session, $before): array|null {
            $entries = array_slice($this->containers->transcript($session, $this->program()), $before);
            $hasEnded = array_any($entries, fn (array $entry): bool => ($entry['message']['stop_reason'] ?? null) === 'end_turn');

            if ($hasEnded) {
                return $entries;
            }

            return null;
        }, 'the turn to end');
    }

    /**
     * The result of the turn's first call of the tool whose input the test accepts; null when the turn made none.
     *
     * @param  list<array<string, mixed>>  $turn
     * @param  callable(array<string, mixed>): bool  $isWanted
     * @return array{text: string, isError: bool}|null
     */
    private function resultOfCall(array $turn, string $tool, callable $isWanted): array|null
    {
        $callId = null;

        foreach ($turn as $entry) {
            foreach ($this->contentOf($entry) as $part) {
                $isCall = ($part['type'] ?? '') === 'tool_use' && ($part['name'] ?? '') === $tool;

                if ($isCall && $callId === null && $isWanted((array) ($part['input'] ?? []))) {
                    $callId = $part['id'] ?? null;
                }

                if (($part['type'] ?? '') === 'tool_result' && $callId !== null && ($part['tool_use_id'] ?? '') === $callId) {
                    return [
                        'text' => $this->textOf($part['content'] ?? ''),
                        'isError' => (bool) ($part['is_error'] ?? false),
                    ];
                }
            }
        }

        return null;
    }

    /**
     * What the session replied at the end of the turn, cut short for an outcome's reason.
     *
     * @param  list<array<string, mixed>>  $turn
     */
    private function replyOf(array $turn): string
    {
        $texts = array_filter(array_map(fn (array $entry): string => $this->assistantText($entry), $turn));

        return mb_substr(trim((string) end($texts)), 0, 200);
    }

    private function send(string $text): void
    {
        $agent = $this->containers->read('main-agent');
        $this->journal->visit("/chat?agent={$agent['agent']}");
        $inbox = $this->containers->read('main-agent')['inbox'];
        $key = strtolower((string) new Ulid());
        $this->journal->postKeyed('/chat/messages', [
            'body' => $text,
            'agent' => $agent['agent'],
            'expectedSessionId' => $agent['session'],
            'expectedGeneration' => $agent['processGeneration'],
            'inboxId' => $inbox,
            'requestKey' => $key,
            'addressee' => null,
            'question' => false,
        ], $key);
    }

    /**
     * @param  array<string, mixed>  $entry
     * @return list<array<string, mixed>>
     */
    private function contentOf(array $entry): array
    {
        $content = $entry['message']['content'] ?? [];

        if (is_array($content)) {
            return array_values(array_filter($content, 'is_array'));
        }

        return [];
    }

    /**
     * @param  array<string, mixed>  $entry
     */
    private function assistantText(array $entry): string
    {
        if (($entry['type'] ?? '') !== 'assistant') {
            return '';
        }

        return implode('', array_map(
            fn (array $part): string => ($part['type'] ?? '') === 'text' ? (string) $part['text'] : '',
            $this->contentOf($entry),
        ));
    }

    private function textOf(mixed $content): string
    {
        if (is_string($content)) {
            return $content;
        }

        if (is_array($content)) {
            return implode('', array_map(fn (mixed $part): string => is_array($part) ? (string) ($part['text'] ?? '') : '', $content));
        }

        return '';
    }

    /**
     * Asks until the question answers something other than null, or fails after the limit with what it waited for.
     *
     * @template T
     *
     * @param  callable(): (T|null)  $question
     * @return T
     */
    private function waitFor(int $seconds, callable $question, string $awaited): mixed
    {
        $deadline = time() + $seconds;
        $nextLine = time();

        while (time() < $deadline) {
            $answer = $question();

            if ($answer !== null) {
                return $answer;
            }

            // A line at least every half minute, so whoever runs the check sees it still works.
            if (time() >= $nextLine) {
                echo 'waiting for ', $awaited, ', ', $deadline - time(), " seconds left\n";
                $nextLine = time() + 30;
            }

            sleep(3);
        }

        throw new RuntimeException("Waited {$seconds} seconds for {$awaited}.");
    }

    private function program(): string
    {
        return self::DRIVERS[$this->driver]['program'];
    }

    private function name(string $path): string
    {
        return basename($path);
    }
}
