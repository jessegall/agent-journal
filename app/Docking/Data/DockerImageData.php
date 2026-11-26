<?php

declare(strict_types=1);

namespace App\Docking\Data;

use App\Projects\Enums\DockerImageName;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * One image the build script built and checked, by digest, with the client versions it holds.
 */
#[MapName(SnakeCaseMapper::class)]
final class DockerImageData extends Data
{
    public function __construct(
        public readonly DockerImageName $name,
        public readonly string $architecture,
        public readonly string $reference,
        public readonly string $claudeCode,
        public readonly string $codex,
        public readonly string $builtAt,
    ) {}

    /**
     * Whether this is the agent image with the given reference.
     */
    public function isAgentImage(string $reference): bool
    {
        return $this->name === DockerImageName::Agent && $this->reference === $reference;
    }
}
