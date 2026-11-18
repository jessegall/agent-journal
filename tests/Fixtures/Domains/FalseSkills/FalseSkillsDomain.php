<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\FalseSkills;

use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Skills\Contracts\ProvidesSkills;

/**
 * A fixture domain that declares a class of its own that is no skill.
 */
final class FalseSkillsDomain extends Domain implements ProvidesSkills
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
