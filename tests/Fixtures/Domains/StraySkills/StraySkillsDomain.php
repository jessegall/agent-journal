<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\StraySkills;

use App\Support\Domain;
use App\Support\Exports;
use App\Contracts\SkillProvider;
use Tests\Fixtures\Modules\Notes\Skills\NotesSkill;

/**
 * A fixture domain that declares another package's skill as its own.
 */
final class StraySkillsDomain extends Domain implements SkillProvider
{
    public function description(): string
    {
        return 'A fixture domain that declares a skill outside its package.';
    }

    public function requires(): array
    {
        return [];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->build();
    }

    public function skills(): array
    {
        return [NotesSkill::class];
    }
}
