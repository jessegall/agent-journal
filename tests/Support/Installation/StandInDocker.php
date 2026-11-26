<?php

declare(strict_types=1);

namespace Tests\Support\Installation;

use Illuminate\Support\Facades\File;

/**
 * The stand-in docker program of tests/Support/Installation/bin, through the folder it keeps its record in: every
 * call a script made, and what the test tells it to do next.
 */
final readonly class StandInDocker
{
    /**
     * The Docker address a script under test is given: a docker program that is not the stand-in fails on it at once,
     * so the normal suite never reaches a real Docker.
     */
    public const string NO_REAL_DOCKER = 'unix:///nonexistent/stand-in-only.sock';

    private const string BUILD_CALL = 'buildx build';

    private const string BUILD_TAG = '--tag journal-%s:build';

    public function __construct(public string $folder) {}

    /**
     * Makes every later Docker call that holds the part fail.
     */
    public function failCallsHolding(string $part): void
    {
        File::append("{$this->folder}/failing", $part."\n");
    }

    /**
     * Lets every Docker call succeed again after failCallsHolding.
     */
    public function stopFailingCalls(): void
    {
        File::delete("{$this->folder}/failing");
    }

    /**
     * Makes the next Docker call that holds the part fail once as Docker itself fails, with exit code 125.
     */
    public function failOnceAsDocker(string $part): void
    {
        File::append("{$this->folder}/docker-errors", $part."\n");
    }

    /**
     * Makes Docker hold these volumes, which a later removal takes away.
     */
    public function holdVolumes(string ...$volumes): void
    {
        File::put("{$this->folder}/volumes", implode("\n", $volumes)."\n");
    }

    /**
     * The volumes Docker still holds.
     *
     * @return list<string>
     */
    public function volumes(): array
    {
        $volumes = "{$this->folder}/volumes";

        return File::exists($volumes) ? array_values(array_filter(explode("\n", File::get($volumes)))) : [];
    }

    /**
     * Makes every later build come out of Docker's cache: the same image as the build before it.
     */
    public function buildFromCache(): void
    {
        File::put("{$this->folder}/cached", '');
    }

    public function hasBuilt(string $image): bool
    {
        $tag = sprintf(self::BUILD_TAG, $image);

        return array_any(
            $this->calls(),
            fn (string $call): bool => str_starts_with($call, self::BUILD_CALL) && str_contains($call, $tag),
        );
    }

    /**
     * Whether Docker was asked for something that holds every part given, in one call.
     */
    public function wasAsked(string ...$parts): bool
    {
        return array_any(
            $this->calls(),
            fn (string $call): bool => array_all($parts, fn (string $part): bool => str_contains($call, $part)),
        );
    }

    /**
     * Every call that holds the part, in the order made.
     *
     * @return list<string>
     */
    public function callsHolding(string $part): array
    {
        return array_values(array_filter($this->calls(), fn (string $call): bool => str_contains($call, $part)));
    }

    /**
     * Forgets the calls so far, so a test reads only those of its next run.
     */
    public function forgetCalls(): void
    {
        File::delete("{$this->folder}/calls.log");
    }

    /**
     * @return list<string>
     */
    public function calls(): array
    {
        $log = "{$this->folder}/calls.log";

        return File::exists($log) ? array_values(array_filter(explode("\n", File::get($log)))) : [];
    }

    /**
     * The environment a script under test runs in: the stand-in programs first on the path, and no real Docker.
     *
     * @return array<string, string>
     */
    public function environment(): array
    {
        return [
            'STAND_IN' => $this->folder,
            'PATH' => __DIR__.'/bin:'.getenv('PATH'),
            'DOCKER_HOST' => self::NO_REAL_DOCKER,
        ];
    }
}
