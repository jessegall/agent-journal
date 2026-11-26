<?php

declare(strict_types=1);

namespace Tests\Support\Agents;

use PHPUnit\Framework\Assert;

/**
 * One message the journal and the agent host exchange, kept as a file both test suites read, so neither side changes it
 * without the other's tests seeing it; run-dependent values are fixed. A missing file is written; after a meant change,
 * remove it or run with UPDATE_CONTRACTS=1.
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
        // A value this run does not have, such as the start of a request the journal supervises none for, names nothing.
        unset($fixedValues['']);
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

    /**
     * The message with this run's own values back in place of the fixed ones, so the journal takes it as sent to it.
     *
     * @param  array<string, string>  $fixedValues  the same map assertHolds takes
     * @return array<array-key, mixed>
     */
    public function readFor(array $fixedValues): array
    {
        unset($fixedValues['']);
        $json = strtr((string) file_get_contents($this->path), array_flip($fixedValues));

        return json_decode($json, true, 512, JSON_THROW_ON_ERROR);
    }
}
