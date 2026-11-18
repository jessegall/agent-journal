<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\BindingType;

/**
 * What the host will actually execute for a program family (doc 21 revision 3, section 52): a built-in or module
 * program trusted by the folders it is installed in, or a project tool trusted by its path and content digest.
 * Relocating a program changes its binding, never its grammar.
 */
final readonly class ExecutableBinding
{
    /**
     * @param  list<string>  $locations  trusted install folders, or the one project-relative path of a project tool
     */
    private function __construct(
        public BindingType $type,
        public string $family,
        public array $locations,
        public string $contentDigest,
        public int $configurationRevision,
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
        string $contentDigest,
        int $configurationRevision,
    ): self {
        return new self(BindingType::ProjectContent, $family, [$relativePath], $contentDigest, $configurationRevision);
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'type' => $this->type->value,
            'family' => $this->family,
            'locations' => $this->locations,
            'content_digest' => $this->contentDigest,
            'configuration_revision' => $this->configurationRevision,
        ];
    }

    /**
     * @param  array<string, mixed>  $fields  the shape toArray writes
     */
    public static function fromArray(array $fields): self
    {
        return new self(
            BindingType::from($fields['type']),
            $fields['family'],
            $fields['locations'],
            $fields['content_digest'],
            $fields['configuration_revision'],
        );
    }

    public function trustsContent(): bool
    {
        return $this->type === BindingType::ProjectContent;
    }
}
