<?php

declare(strict_types=1);

namespace App\Skills\Readers;

use App\Skills\Contracts\SkillReader;
use App\Skills\Values\SkillEntry;
use App\Skills\Values\SkillKey;
use Closure;

/**
 * The skill catalogue of one request, built on its first read: building it reads the stored skills, so resolving a
 * class that takes a SkillReader never touches the database by itself.
 */
final class CatalogueOnFirstRead implements SkillReader
{
    private SkillCatalogue|null $catalogue = null;

    /**
     * @param  Closure(): SkillCatalogue  $build
     */
    public function __construct(private readonly Closure $build) {}

    public function all(): array
    {
        return $this->catalogue()->all();
    }

    public function find(SkillKey $key): SkillEntry
    {
        return $this->catalogue()->find($key);
    }

    private function catalogue(): SkillCatalogue
    {
        return $this->catalogue ??= ($this->build)();
    }
}
