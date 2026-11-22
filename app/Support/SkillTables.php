<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Database\Schema\Builder;

/**
 * Whether the tables the skill supervisor writes exist yet, so a host started before its migrations is told so.
 */
final readonly class SkillTables
{
    /**
     * @param  list<string>  $tables
     */
    public function __construct(
        private Builder $schema,
        private array $tables,
    ) {}

    public function exist(): bool
    {
        foreach ($this->tables as $table) {
            if (! $this->schema->hasTable($table)) {
                return false;
            }
        }

        return true;
    }
}
