<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\FalseSkills;

use App\Skills\Contracts\SkillProvider;
use App\Support\Domain;
use App\Support\Exports;

/**
 * A fixture domain that declares a class of its own that is no skill.
 */
final class FalseSkillsDomain extends Domain implements SkillProvider
{
    public function description(): string
    {
        return 'A fixture domain that declares a class that is no skill.';
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

    /**
     * @return list<class-string>
     */
    public function skills(): array
    {
        return [self::class];
    }
}
