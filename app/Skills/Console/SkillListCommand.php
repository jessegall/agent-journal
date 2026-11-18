<?php

declare(strict_types=1);

namespace App\Skills\Console;

use App\Skills\Contracts\SkillReader;
use App\Skills\Exceptions\SkillConflict;
use App\Skills\Exceptions\SkillDeclarationInvalid;
use App\Skills\Exceptions\SkillSourceInvalid;
use App\Skills\Values\SkillEntry;
use Illuminate\Console\Command;
use Illuminate\Contracts\Container\Container;

/**
 * Lists the skill catalogue: each skill's key, name, owner, origin and digest, or why the catalogue cannot be built.
 */
final class SkillListCommand extends Command
{
    protected $signature = 'skill:list {--json : Print the list as JSON}';

    protected $description = 'List the skills of the catalogue';

    public function handle(Container $container): int
    {
        try {
            $skills = $container->make(SkillReader::class)->all();
        } catch (SkillSourceInvalid|SkillConflict|SkillDeclarationInvalid $failure) {
            $this->error($failure->getMessage());

            return self::FAILURE;
        }

        $rows = array_map(fn (SkillEntry $skill) => ['key' => $skill->key->key, 'name' => $skill->name, 'owner' => $skill->owner, 'source' => $skill->origin->value, 'digest' => $skill->rendered->digest], $skills);

        if ($this->option('json')) {
            $this->line(json_encode($rows, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));

            return self::SUCCESS;
        }

        $this->table(['Key', 'Name', 'Owner', 'Source', 'Digest'], array_map(array_values(...), $rows));

        return self::SUCCESS;
    }
}
