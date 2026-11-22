<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\SkillResolver;
use App\Values\SkillEntry;
use App\Values\SkillKey;
use Closure;

/**
 * The skill catalogue of one request, built on its first read: building it reads the stored skills, so resolving a
 * class that takes a SkillResolver never touches the database by itself.
 */
final class CatalogueOnFirstRead implements SkillResolver
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
