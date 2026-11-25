<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\BindingType;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * What the host will actually execute for a program family: a built-in or module
 * program trusted by the folders it is installed in, or a project tool trusted by its path and content digest.
 * Relocating a program changes its binding, never its grammar.
 */
#[MapName(SnakeCaseMapper::class)]
final class ExecutableBinding extends Data
{
    /**
     * @param  list<string>  $locations  trusted install folders, or the one project-relative path of a project tool
     */
    public function __construct(
        public readonly BindingType $type,
        public readonly string $family,
        public readonly array $locations,
        public readonly string $contentDigest,
        public readonly int $configurationRevision,
    ) {}

    /**
     * @param  list<string>  $folders
     */
    public static function builtin(string $family, array $folders): self
    {
        return new self(BindingType::BuiltinSearchPath, $family, $folders, '', 0);
    }

    /**
     * @param  list<string>  $folders
     */
    public static function modulePackage(string $family, array $folders): self
    {
        return new self(BindingType::ModulePackage, $family, $folders, '', 0);
    }

    public static function projectContent(
        string $family,
        string $relativePath,
        string $digest,
        int $configurationRevision,
    ): self {
        return new self(BindingType::ProjectContent, $family, [$relativePath], $digest, $configurationRevision);
    }

    /**
     * The binding as it was stored, read back without the checks of a new one.
     *
     * @param  list<string>  $locations
     */
    public static function stored(
        BindingType $type,
        string $family,
        array $locations,
        string $contentDigest,
        int $configurationRevision,
    ): self {
        return new self($type, $family, $locations, $contentDigest, $configurationRevision);
    }

    public function trustsContent(): bool
    {
        return $this->type === BindingType::ProjectContent;
    }
}
