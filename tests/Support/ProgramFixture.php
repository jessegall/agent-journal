<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Hooks\Drivers\HookPayload;

/**
 * The recorded hook payloads of one program and the mapping its capability record expects, read from
 * tests/Fixtures/Hooks.
 */
final readonly class ProgramFixture
{
    /**
     * @param  array<string, array<string, mixed>>  $payloads
     * @param  array<string, string>  $mapping
     * @param  list<string>  $unmappedInputs
     */
    private function __construct(
        private array $payloads,
        private array $mapping,
        private array $unmappedInputs,
    ) {}

    public static function load(string $folder): self
    {
        $read = fn (string $file): array => json_decode(
            (string) file_get_contents(dirname(__DIR__)."/Fixtures/Hooks/{$folder}/{$file}"),
            true,
            flags: JSON_THROW_ON_ERROR,
        );
        $hooks = $read('hooks.json');
        $capabilities = $read('capabilities.json');

        return new self($hooks['payloads'], $capabilities['mapping'], $capabilities['unmapped inputs']);
    }

    public function payload(string $name): HookPayload
    {
        return HookPayload::from($this->payloads[$name]);
    }

    /**
     * @return array<string, string>
     */
    public function mapping(): array
    {
        return $this->mapping;
    }

    /**
     * @return list<string>
     */
    public function unmappedInputs(): array
    {
        return $this->unmappedInputs;
    }
}
