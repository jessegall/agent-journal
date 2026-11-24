<?php

declare(strict_types=1);

namespace Tools\InstallationChecks;

use RuntimeException;
use Symfony\Component\Uid\Ulid;

/**
 * Tasks 1772 and 1773 as one run: a protected headless session on the cheapest model, started through the request the
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

    // The driver's program and its cheapest model (user message 19195).
    private const array DRIVERS = [
        'claude-code' => ['program' => 'claude', 'model' => 'claude-haiku-5-5'],
        'codex' => ['program' => 'codex', 'model' => 'gpt-6-luna'],
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
        $container = $this->start();
        $this->containers->probe('setup', $container, $this->program());
        $this->judgeReads($container);
        $this->judgeAnswer($container, 'a question is answered');
        $this->judgeRenewal($container);
        $this->stop();
        $resumed = $this->start();
        $this->judgeAnswer($resumed, 'a question is answered after a stop and a start, with no sign-in');
        $this->judgeReads($resumed);
        $this->containers->probe('cleanup', $resumed, $this->program());

        return $this->outcomes;
    }

    /**
     * Starts the main agent's session as the Start dialog does and answers its container once it runs.
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

            return $agent['status'] === 'running' ? (string) $agent['session'] : null;
        }, 'the session to run');

        return $this->waitFor(
            self::START_LIMIT,
            fn (): string|null => $this->containers->sessionContainer($session) ?: null,
            'the session container',
        );
    }

    private function stop(): void
    {
        $agent = $this->containers->read('main-agent');
        $requestId = strtolower((string) new Ulid());
        $this->journal->postKeyed("/agents/{$agent['agent']}/stop", [
            'requestId' => $requestId,
            'sessionId' => $agent['session'],
            'generation' => $agent['generation'],
        ], $requestId);
        $this->waitFor(self::START_LIMIT, function (): bool|null {
            return $this->containers->read('main-agent')['status'] !== 'running' ? true : null;
        }, 'the session to stop');
    }

    private function judgeReads(string $container): void
    {
        $marker = trim($this->containers->probe('expect', $container, $this->program()));
        $credentials = self::CREDENTIALS[$this->program()];
        $account = dirname(self::CANARY);
        $clientRoot = '/proc/$(for p in /proc/[0-9]*; do [ "$(stat -c %u $p)" = 10001 ] && echo ${p#/proc/} && break; done)/root';

        $this->judgeBash($container, 'the workspace marker reads through Bash', 'cat '.self::MARKER, $marker);
        $this->judgeBash($container, 'Bash runs as the executor, user 10002', 'id -u', '10002');

        foreach ([
            'the canary' => self::CANARY,
            'the credential file' => $credentials,
            'the canary through a workspace link' => "/workspace/.account-link/{$this->name(self::CANARY)}",
            'the canary through the client\'s /proc root' => $clientRoot.self::CANARY,
        ] as $item => $path) {
            $line = "ln -sfn {$account} /workspace/.account-link; ( exec 3< {$path} ) 2>&1 | sed 's/.*: //'";
            $this->judgeBash($container, "{$item} is refused with a permission error", $line, 'Permission denied');
        }

        $this->judgeBash(
            $container,
            'the environment and the open files hold no credential',
            'env | grep -ciE "sk-ant|oauth|access_token|refresh_token"; ls -l /proc/self/fd | grep -c credentials',
            "0\n0",
        );
        $this->judgeRead($container, 'the native Read tool reads the workspace marker', self::MARKER, true, $marker);
        $this->judgeRead($container, 'the native Read tool is refused the canary', self::CANARY, false, '');
    }

    private function judgeBash(string $container, string $item, string $line, string $expected): void
    {
        $result = $this->toolResult(
            $container,
            "Run exactly this command with your Bash tool, once, and reply only with its output:\n\n{$line}",
            'Bash',
        );
        $this->outcomes[] = Outcome::judged(
            $item,
            trim($result['text']) === $expected,
            trim($result['text']) === $expected ? 'as expected' : 'the command answered something else',
        );
    }

    private function judgeRead(string $container, string $item, string $path, bool $isReadable, string $expected): void
    {
        $result = $this->toolResult(
            $container,
            "Read the file {$path} with your Read tool, once, and reply only with what it gave you.",
            'Read',
        );
        $isPassed = $isReadable
            ? ! $result['isError'] && str_contains($result['text'], $expected)
            : $result['isError'] && preg_match('/permission|EACCES/i', $result['text']) === 1;
        $this->outcomes[] = Outcome::judged($item, $isPassed, $isPassed ? 'as expected' : 'the Read tool answered otherwise');
    }

    private function judgeAnswer(string $container, string $item): void
    {
        $before = count($this->containers->transcript($container));
        $this->send('What is two plus two? Reply with the number alone.');
        $answer = $this->waitFor(self::ANSWER_LIMIT, function () use ($container, $before): string|null {
            foreach (array_slice($this->containers->transcript($container), $before) as $entry) {
                $text = $this->assistantText($entry);

                if ($text !== '') {
                    return $text;
                }
            }

            return null;
        }, 'an answer');
        $this->outcomes[] = Outcome::judged($item, str_contains($answer, '4'), 'the session answered');
    }

    /**
     * The credential's expiry before and after it renews: the wait lasts until the expiry has passed, unless the
     * renewal is left out.
     */
    private function judgeRenewal(string $container): void
    {
        if ($this->isRenewalSkipped) {
            return;
        }

        $before = $this->expiry($container);
        $this->waitFor(max(60, $before - time() + 120), fn (): bool|null => time() > $before ? true : null, 'the expiry');
        $this->judgeAnswer($container, 'a question is answered once the access token expired');
        $after = $this->expiry($container);
        $this->outcomes[] = Outcome::judged('the credential renewed', $after > $before, "expiry {$before} became {$after}");
    }

    private function expiry(string $container): int
    {
        $state = $this->containers->probe('credential-state', $container, $this->program());

        return preg_match('/expiresAt (\d+)/', $state, $found) === 1 ? intdiv((int) $found[1], 1000) : 0;
    }

    /**
     * Sends the message to the session and answers the result of the first call of the tool after it.
     *
     * @return array{text: string, isError: bool}
     */
    private function toolResult(string $container, string $message, string $tool): array
    {
        $before = count($this->containers->transcript($container));
        $this->send($message);

        return $this->waitFor(self::ANSWER_LIMIT, function () use ($container, $before, $tool): array|null {
            $entries = array_slice($this->containers->transcript($container), $before);
            $callId = null;

            foreach ($entries as $entry) {
                foreach ($this->contentOf($entry) as $part) {
                    if (($part['type'] ?? '') === 'tool_use' && ($part['name'] ?? '') === $tool) {
                        $callId ??= $part['id'] ?? null;
                    }

                    if (($part['type'] ?? '') === 'tool_result' && $callId !== null && ($part['tool_use_id'] ?? '') === $callId) {
                        return ['text' => $this->textOf($part['content'] ?? ''), 'isError' => (bool) ($part['is_error'] ?? false)];
                    }
                }
            }

            return null;
        }, "the {$tool} tool's result");
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
            'expectedGeneration' => $agent['generation'],
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

        return is_array($content) ? array_values(array_filter($content, 'is_array')) : [];
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

        return is_array($content)
            ? implode('', array_map(fn (mixed $part): string => is_array($part) ? (string) ($part['text'] ?? '') : '', $content))
            : '';
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

        while (time() < $deadline) {
            $answer = $question();

            if ($answer !== null) {
                return $answer;
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
