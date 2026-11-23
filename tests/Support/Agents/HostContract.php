<?php

declare(strict_types=1);

namespace Tests\Support\Agents;

use PHPUnit\Framework\Assert;

/**
 * One message the journal and the agent host exchange, kept as a file both test suites read: a PHP test checks that
 * the journal's real answer still is the file, and the host's Go scenarios (tools/journal-agent/scenarios) start from
 * the same file, so neither side can change the message without the other's tests seeing it. Values that differ on
 * every run, such as ids and tokens, are replaced by fixed ones. A file that is missing is written; after a change
 * that is meant, remove the file (or run with UPDATE_CONTRACTS=1) and run the test again.
 */
final readonly class HostContract
{
    private const int JSON_FLAGS = JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR;

    private const string UPDATE_SWITCH = 'UPDATE_CONTRACTS';

    private function __construct(private string $path) {}

    public static function of(string $name): self
    {
        return new self(base_path("tests/Contracts/{$name}"));
    }

    /**
     * @param  array<array-key, mixed>  $actual
     * @param  array<string, string>  $fixedValues  each value that differs per run, and the fixed one that stands for it
     */
    public function assertHolds(array $actual, array $fixedValues): void
    {
        $json = strtr(json_encode($actual, self::JSON_FLAGS), $fixedValues)."\n";

        if (getenv(self::UPDATE_SWITCH) === '1' || ! is_file($this->path)) {
            file_put_contents($this->path, $json);
        }

        Assert::assertJsonStringEqualsJsonFile($this->path, $json, self::UPDATE_SWITCH.'=1');
    }

    /**
     * The message as the file holds it, for a test that sends the host's side of the exchange to the journal.
     *
     * @return array<array-key, mixed>
     */
    public function read(): array
    {
        return json_decode((string) file_get_contents($this->path), true, 512, JSON_THROW_ON_ERROR);
    }
}
